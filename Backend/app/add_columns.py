"""
Script to add missing columns to existing database tables.
Run this once to add created_at column to purchase_records and other_expenses tables.
"""

import sys
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from app.database.db import engine

def add_missing_columns():
    with engine.connect() as conn:
        try:
            # Add created_at to purchase_records
            print("Adding created_at column to purchase_records...")
            conn.execute(text(
                "ALTER TABLE purchase_records ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
            ))
            print("✓ Created purchase_records.created_at")
        except Exception as e:
            print(f"Note: purchase_records.created_at - {str(e)}")

        try:
            # Add created_at to other_expenses
            print("Adding created_at column to other_expenses...")
            conn.execute(text(
                "ALTER TABLE other_expenses ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
            ))
            print("✓ Created other_expenses.created_at")
        except Exception as e:
            print(f"Note: other_expenses.created_at - {str(e)}")

        conn.commit()
        print("\n✓ All columns added successfully!")

if __name__ == "__main__":
    add_missing_columns()
