import os
import re
import time
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy import text
from app.utils.system_promt import SYSTEM_PROMPT
from app.database.db import engine

load_dotenv(dotenv_path=".env")

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SCHEMA = """
Tables:

mango_records
- id
- name
- contact_number
- city
- box
- price
- total_payment
- payment_status
- delivery_status

purchase_records
- id
- total_box
- price
- transportation_charge
- total_cost
- final_cost
- created_at

other_expenses
- id
- purchase_id
- text
- amount
- created_at
"""

MODEL_NAME = "llama-3.3-70b-versatile"

GUJARATI_RANGE = re.compile(r"[\u0A80-\u0AFF]")

GREETING_KEYWORDS = (
    "hello",
    "hi",
    "hey",
    "hy",
    "hii",
    "hyy",
    "namaste",
    "namaskar",
    "good morning",
    "good afternoon",
    "good evening",
)

SECURITY_KEYWORDS = (
    "password",
    "api key",
    "apikey",
    "secret key",
    "secret",
    "token",
    "credential",
    "credentials",
    "database password",
    "backend code",
    "internal prompt",
    "system prompt",
    "security",
)

BOOLEAN_SQL_FIXES = (
    (r"payment_status\s*=\s*'pending'", "payment_status IS FALSE"),
    (r"payment_status\s*=\s*'paid'", "payment_status IS TRUE"),
    (r"payment_status\s*=\s*'done'", "payment_status IS TRUE"),
    (r"payment_status\s*=\s*'completed'", "payment_status IS TRUE"),
    (r"delivery_status\s*=\s*'pending'", "delivery_status IS FALSE"),
    (r"delivery_status\s*=\s*'delivered'", "delivery_status IS TRUE"),
    (r"delivery_status\s*=\s*'done'", "delivery_status IS TRUE"),
    (r"delivery_status\s*=\s*'completed'", "delivery_status IS TRUE"),
)

LOCALIZED_MESSAGES = {
    "english": {
        "greeting": "Hello! I'm Kesar King AI. Ask me about sales, pending payments, delivery status, purchases, or expenses.",
        "security": "I can help with business records and summaries, but I can't assist with passwords, keys, private access, or security details.",
        "no_data": "I could not find any matching record for this request.",
        "fetch_failed": "I could not fetch the data right now. Please try again in a moment.",
        "unsafe": "I can help with business information only. Please ask about sales, payments, deliveries, purchases, or expenses.",
    },
    "gujarati": {
        "greeting": "Namaste! Hu Kesar King AI chu. Tame sales, pending payment, delivery status, purchase ane expenses vishe puchi sako cho.",
        "security": "Hu business records ane summaries ma madad kari saku chu, pan password, key, private access athva security details ma madad nahi kari saku.",
        "no_data": "Aa request mate mane koi matching record nathi malyu.",
        "fetch_failed": "Haal data fetch nathi thayu. Thodi vaar pachi fari try karo.",
        "unsafe": "Hu faki business information ma madad kari saku chu. Kripya sales, payments, deliveries, purchases athva expenses vishe pucho.",
    },
}


def detect_language(question: str) -> str:
    return "gujarati" if GUJARATI_RANGE.search(question or "") else "english"


def normalized_text(question: str) -> str:
    return re.sub(r"\s+", " ", (question or "").strip().lower())


def contains_any(question: str, keywords) -> bool:
    text_value = normalized_text(question)
    for keyword in keywords:
        pattern = r"\b" + re.escape(keyword) + r"\b"
        if re.search(pattern, text_value):
            return True
    return False


def is_greeting(question: str) -> bool:
    return contains_any(question, GREETING_KEYWORDS)


def is_security_request(question: str) -> bool:
    return contains_any(question, SECURITY_KEYWORDS)


def localized_message(question: str, key: str) -> str:
    language = detect_language(question)
    return LOCALIZED_MESSAGES[language][key]


def ask_ai_completion(question: str):
    if is_greeting(question):
        return {"answer": localized_message(question, "greeting")}

    if is_security_request(question):
        return {"answer": localized_message(question, "security")}

    prompt = f"""
        You are Kesar King AI assistant.
        Answer the user's question clearly and directly in one or two complete sentences.
        Reply in English unless the question is in Gujarati; if Gujarati, reply in Gujarati.
        Do not mention SQL, databases, or internal system details.
        Be friendly, professional, and concise.
        Question: {question}
        """

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            max_tokens=220,
            temperature=0.2,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        answer_text = response.choices[0].message.content.strip()
    except Exception:
        answer_text = None

    if not answer_text or len(answer_text.split()) < 3:
        answer_text = localized_message(question, "fetch_failed")

    return {"answer": answer_text}


def sanitize_boolean_sql(sql_query: str) -> str:
    cleaned_query = sql_query
    for pattern, replacement in BOOLEAN_SQL_FIXES:
        cleaned_query = re.sub(pattern, replacement, cleaned_query, flags=re.IGNORECASE)
    return cleaned_query


def rows_to_records(result):
    columns = list(result.keys())
    return [dict(zip(columns, row)) for row in result.fetchall()]


def short_label_from_question(question: str) -> str:
    text_value = normalized_text(question)
    labels = [
        ("pending payment", "Pending payment"),
        ("payment", "Payment"),
        ("pending delivery", "Pending delivery"),
        ("delivery", "Delivery"),
        ("total profit", "Total profit"),
        ("profit", "Profit"),
        ("total cost", "Total cost"),
        ("cost", "Total cost"),
        ("expense", "Total expenses"),
        ("purchase", "Purchase total"),
        ("stock", "Stock"),
        ("mango", "Mango records"),
    ]
    for keyword, label in labels:
        if keyword in text_value:
            return label
    return "Result"


def build_direct_answer(question: str, records) -> str:
    if not records:
        return localized_message(question, "no_data")

    if len(records) == 1:
        record = records[0]
        if len(record) == 1:
            value = next(iter(record.values()))
            return f"{short_label_from_question(question)}: {value}"

        parts = []
        for key, value in record.items():
            pretty_key = key.replace("_", " ").title()
            parts.append(f"{pretty_key}: {value}")
        return f"{short_label_from_question(question)}: " + ", ".join(parts)

    summary_lines = []
    for record in records[:5]:
        if not record:
            continue
        label = []
        for key, value in list(record.items())[:3]:
            pretty_key = key.replace("_", " ").title()
            label.append(f"{pretty_key}: {value}")
        if label:
            summary_lines.append(" | ".join(label))

    if summary_lines:
        return f"{short_label_from_question(question)}: " + "; ".join(summary_lines)

    return localized_message(question, "fetch_failed")


def ask_ai(question: str):
    if is_greeting(question):
        return {"answer": localized_message(question, "greeting")}

    if is_security_request(question):
        return {"answer": localized_message(question, "security")}

    prompt = f"""
        {SYSTEM_PROMPT}
        Database Schema: {SCHEMA}
        Convert user question into PostgreSQL SELECT query.
        Important:
        - payment_status and delivery_status are BOOLEAN columns.
        - Use TRUE / FALSE for those columns.
        - Never compare boolean columns to strings like 'pending' or 'done'.
        Question: {question}
        Return ONLY raw SQL query."""

    response = None

    for i in range(3):

        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                max_tokens=220,
                temperature=0,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            break
        except Exception as e:
            print("Retrying...", e)
            time.sleep(5)

    if response is None:
        return {"answer": localized_message(question, "fetch_failed")}

    sql_query = response.choices[0].message.content.strip()

    sql_query = sql_query.replace("```sql", "").replace("```", "").strip()
    sql_query = sanitize_boolean_sql(sql_query)

    if not sql_query.lower().startswith("select"):
        return {"answer": localized_message(question, "unsafe")}

    try:

        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            records = rows_to_records(result)

        if not records:
            return {"answer": localized_message(question, "no_data")}

        final_prompt = f"""
            You are Kesar King AI assistant.
            Answer naturally, professionally, and directly.
            Reply in English unless the user's question is in Gujarati; if Gujarati, reply in Gujarati.
            Question: {question}
            Database Result:
            {records}
            Rules:
            - Give one complete answer in one or two sentences.
            - If the result is a single number or single row, state it clearly with a label.
            - Do not add follow-up questions.
            - Do not cut the answer short.
            - Human friendly
            - Do not show SQL
            - Do not mention database
            - Sound like business assistant
            """
        final_response = client.chat.completions.create(
            model=MODEL_NAME,
            max_tokens=220,
            temperature=0.2,
            messages=[
                {"role": "user", "content": final_prompt}
            ]
        )

        answer_text = final_response.choices[0].message.content.strip()
        if not answer_text or len(answer_text.split()) < 3:
            answer_text = build_direct_answer(question, records)

        return {
            "answer": answer_text
        }

    except Exception as e:
        return {"answer": build_direct_answer(question, [])}
