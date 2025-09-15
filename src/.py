'''
Dynamic Sqlite CRUD class for python
'''

import sqlite3

class DynamicCRUD:
    def __init__(self, db_path):
        self.db_path = db_path
        self.conn = None

    def _get_connection(self):
        if self.conn is None:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row # Access columns by name
        return self.conn

    def _execute_query(self, query, params=()):
        conn = self._get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, params)
            conn.commit()
            return cursor
        except sqlite3.Error as e:
            print(f"Database error: {e}")
            conn.rollback()
            return None

    def create_table(self, table_name, columns):
        # columns is a dictionary like {'id': 'INTEGER PRIMARY KEY', 'name': 'TEXT'}
        column_defs = ", ".join([f"{col_name} {col_type}" for col_name, col_type in columns.items()])
        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({column_defs})"
        self._execute_query(query)

    def create(self, table_name, data):
        # data is a dictionary like {'name': 'Alice', 'age': 30}
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data.values()])
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        self._execute_query(query, tuple(data.values()))

    def read(self, table_name, columns="*", conditions="", params=()):
        query = f"SELECT {columns} FROM {table_name}"
        if conditions:
            query += f" WHERE {conditions}"
        cursor = self._execute_query(query, params)
        return cursor.fetchall() if cursor else []

    def update(self, table_name, data, conditions, params=()):
        set_clause = ", ".join([f"{col_name} = ?" for col_name in data.keys()])
        query = f"UPDATE {table_name} SET {set_clause} WHERE {conditions}"
        self._execute_query(query, tuple(data.values()) + params)

    def delete(self, table_name, conditions, params=()):
        query = f"DELETE FROM {table_name} WHERE {conditions}"
        self._execute_query(query, params)

    def close(self):
        if self.conn:
            self.conn.close()
            self.conn = None