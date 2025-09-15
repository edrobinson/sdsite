import sqlite3
from sqlite3 import Error

class GeminiSQLiteCRUD:
    """
    A generic Python class to provide CRUD services for any table in an EXISTING SQLite database.
    This class does NOT include table creation functionality.
    Created by Gemini.
    """

    def __init__(self, db_path):
        """
        Initializes the GenericSQLiteCRUD instance.

        Args:
            db_path (str): The path to the SQLite database file.
        """
        self.db_path = db_path
        self.conn = None
        self.cursor = None
        self._connect() # Establish connection upon instantiation

    def _connect(self):
        """Establishes a connection to the SQLite database."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row # Optional: access columns by name
            self.cursor = self.conn.cursor()
            print(f"Connected to SQLite database: {self.db_path}")
        except Error as e:
            print(f"Error connecting to database: {e}")
            raise # Re-raise the exception to indicate connection failure

    def _close(self):
        """Closes the database connection."""
        if self.conn:
            self.conn.close()
            print("Database connection closed.")

    def _execute_query(self, query, params=None, fetch_one=False, fetch_all=False):
        """
        Executes an SQL query with optional parameters.

        Args:
            query (str): The SQL query string.
            params (tuple, list, optional): Parameters for the query. Defaults to None.
            fetch_one (bool): If True, fetches and returns one row.
            fetch_all (bool): If True, fetches and returns all rows.

        Returns:
            list or tuple or None: Fetched data (as sqlite3.Row objects if row_factory is set),
                                   or None for DML operations.
        """
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            self.conn.commit()

            if fetch_one:
                return self.cursor.fetchone()
            elif fetch_all:
                return self.cursor.fetchall()
            return None # For DML operations like INSERT, UPDATE, DELETE

        except Error as e:
            print(f"Error executing query: {query}\nError: {e}")
            self.conn.rollback() # Rollback changes on error
            return None

    # --- CRUD Operations ---

    def insert(self, table_name, data):
        """
        Inserts a new record into the specified table.

        Args:
            table_name (str): The name of the table.
            data (dict): A dictionary where keys are column names and values are
                         the data to insert.

        Returns:
            int or None: The ID of the newly inserted row, or None on failure.
        """
        if not table_name or not data:
            print("Table name and data cannot be empty for insert operation.")
            return None

        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?' for _ in data.values()])
        values = tuple(data.values())

        insert_sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        self._execute_query(insert_sql, values)
        if self.cursor:
            return self.cursor.lastrowid
        return None

    def select_all(self, table_name):
        """
        Retrieves all records from the specified table.

        Args:
            table_name (str): The name of the table.

        Returns:
            list: A list of sqlite3.Row objects (or tuples if row_factory is not set),
                  where each object represents a row.
        """
        if not table_name:
            print("Table name cannot be empty for select_all operation.")
            return []
        select_sql = f"SELECT * FROM {table_name}"
        return self._execute_query(select_sql, fetch_all=True)

    def select_where(self, table_name, conditions, columns="*"):
        """
        Retrieves records from the specified table based on conditions.

        Args:
            table_name (str): The name of the table.
            conditions (dict): A dictionary where keys are column names and values
                               are the desired match values (e.g., {"name": "Laptop", "status": "active"}).
            columns (str): Comma-separated string of columns to select (e.g., "id, name").
                           Defaults to "*".

        Returns:
            list: A list of sqlite3.Row objects (or tuples if row_factory is not set),
                  where each object represents a row.
        """
        if not table_name or not conditions:
            print("Table name and conditions cannot be empty for select_where operation.")
            return []

        where_clauses = []
        params = []
        for col, value in conditions.items():
            where_clauses.append(f"{col} = ?")
            params.append(value)

        select_sql = f"SELECT {columns} FROM {table_name} WHERE {' AND '.join(where_clauses)}"
        return self._execute_query(select_sql, tuple(params), fetch_all=True)

    def update(self, table_name, data, conditions):
        """
        Updates records in the specified table.

        Args:
            table_name (str): The name of the table.
            data (dict): A dictionary of column-value pairs to update (e.g., {"quantity": 20, "price": 99.99}).
            conditions (dict): A dictionary of column-value pairs to identify records
                               to update (e.g., {"id": 1, "status": "pending"}).

        Returns:
            bool: True if the update was successful, False otherwise.
        """
        if not table_name or not data or not conditions:
            print("Table name, update data, and conditions cannot be empty for update operation.")
            return False

        set_clauses = []
        set_params = []
        for col, value in data.items():
            set_clauses.append(f"{col} = ?")
            set_params.append(value)

        where_clauses = []
        where_params = []
        for col, value in conditions.items():
            where_clauses.append(f"{col} = ?")
            where_params.append(value)

        update_sql = f"UPDATE {table_name} SET {', '.join(set_clauses)} WHERE {' AND '.join(where_clauses)}"
        all_params = tuple(set_params + where_params)

        result = self._execute_query(update_sql, all_params)
        return result is not None

    def delete(self, table_name, conditions):
        """
        Deletes records from the specified table.

        Args:
            table_name (str): The name of the table.
            conditions (dict): A dictionary of column-value pairs to identify records
                               to delete (e.g., {"id": 1, "category": "old"}).

        Returns:
            bool: True if the deletion was successful, False otherwise.
        """
        if not table_name or not conditions:
            print("Table name and conditions cannot be empty for delete operation.")
            return False

        where_clauses = []
        params = []
        for col, value in conditions.items():
            where_clauses.append(f"{col} = ?")
            params.append(value)

        delete_sql = f"DELETE FROM {table_name} WHERE {' AND '.join(where_clauses)}"
        result = self._execute_query(delete_sql, tuple(params))
        return result is not None

    def __enter__(self):
        """Context manager entry point."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit point, ensures connection is closed."""
        self._close()


# --- Example Usage with an Existing Database ---
if __name__ == "__main__":
    # IMPORTANT: Replace 'your_existing_database.db' with the actual path to your DB file.
    # Also, ensure that the tables 'users' and 'products' (or whatever tables you use)
    # already exist in this database with the expected column names.
    db_file = "../db/db.sqlite3" # <--- !!! CHANGE THIS !!!

    print(f"Attempting to connect to existing database: {db_file}")

    try:
        # Create a dummy database for demonstration if it doesn't exist
        # In a real scenario, this would be your pre-existing DB
        conn_check = sqlite3.connect(db_file)
        cursor_check = conn_check.cursor()
        cursor_check.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL
            );
        """)
        cursor_check.execute("""
            CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock_quantity INTEGER DEFAULT 0
            );
        """)
        conn_check.commit()
        conn_check.close()
        print(f"Ensured 'users' and 'products' tables exist in '{db_file}' for demonstration purposes.")
        print("In a real application, you would just connect to your existing DB.")

    except Error as e:
        print(f"Error preparing dummy database: {e}")
        print("Please ensure your actual database exists and is accessible.")
        exit()


    with GeminiSQLiteCRUD(db_file) as db:
        # --- Users Table Operations ---
        print("\n--- Users Table Operations ---")

        # Insert new users (assuming 'users' table exists with 'username', 'email' columns)
        user_id1 = db.insert("users", {"username": "carol", "email": "carol@example.com"})
        if user_id1:
            print(f"Inserted user 'carol' with ID: {user_id1}")
        user_id2 = db.insert("users", {"username": "dave", "email": "dave@example.com"})
        if user_id2:
            print(f"Inserted user 'dave' with ID: {user_id2}")

        print("\nAll users:")
        all_users = db.select_all("users")
        for user in all_users:
            print(f"ID: {user['id']}, Username: {user['username']}, Email: {user['email']}") # Access by column name

        print("\nUser with username 'carol':")
        carol = db.select_where("users", {"username": "carol"})
        if carol:
            for row in carol:
                 print(f"Found: ID: {row['id']}, Username: {row['username']}, Email: {row['email']}")

        if user_id1: # Only update if the insert was successful
            print(f"\nUpdating user with ID {user_id1}...")
            if db.update("users", {"email": "carol.updates@example.com"}, {"id": user_id1}):
                print("Update successful!")
            else:
                print("Update failed.")
            updated_carol = db.select_where("users", {"id": user_id1})
            if updated_carol:
                for row in updated_carol:
                    print(f"Updated user: ID: {row['id']}, Username: {row['username']}, Email: {row['email']}")

        if user_id2: # Only delete if the insert was successful
            print(f"\nDeleting user with ID {user_id2}...")
            if db.delete("users", {"id": user_id2}):
                print("Deletion successful!")
            else:
                print("Deletion failed.")

        print("\nAll users after deletion:")
        for user in db.select_all("users"):
            print(f"ID: {user['id']}, Username: {user['username']}, Email: {user['email']}")


        # --- Products Table Operations ---
        print("\n--- Products Table Operations ---")

        # Insert new products (assuming 'products' table exists)
        product_id1 = db.insert("products", {"name": "Monitor", "price": 299.99, "stock_quantity": 25})
        if product_id1:
            print(f"Inserted product 'Monitor' with ID: {product_id1}")
        product_id2 = db.insert("products", {"name": "Webcam", "price": 45.00, "stock_quantity": 150})
        if product_id2:
            print(f"Inserted product 'Webcam' with ID: {product_id2}")

        print("\nAll products:")
        all_products = db.select_all("products")
        for product in all_products:
            print(f"ID: {product['product_id']}, Name: {product['name']}, Price: {product['price']}, Stock: {product['stock_quantity']}")

        print("\nProducts with price less than 100:")
        # For non-equality conditions (like <, >), you'd need a more advanced `select_where`
        # or a separate `execute_custom_query` method. The current `select_where` uses `=`.
        # Example showing select_where for exact match of stock:
        products_low_stock = db.select_where("products", {"stock_quantity": 150})
        if products_low_stock:
            for prod in products_low_stock:
                print(f"Found: ID: {prod['product_id']}, Name: {prod['name']}, Price: {prod['price']}, Stock: {prod['stock_quantity']}")

        if product_id1:
            print(f"\nUpdating product '{product_id1}' stock...")
            if db.update("products", {"stock_quantity": 20, "price": 289.99}, {"product_id": product_id1}):
                print("Update successful!")
            else:
                print("Update failed.")
            updated_product = db.select_where("products", {"product_id": product_id1})
            if updated_product:
                for row in updated_product:
                    print(f"Updated product: ID: {row['product_id']}, Name: {row['name']}, Price: {row['price']}, Stock: {row['stock_quantity']}")

        if product_id2:
            print(f"\nDeleting product '{product_id2}'...")
            if db.delete("products", {"product_id": product_id2}):
                print("Deletion successful!")
            else:
                print("Deletion failed.")

        print("\nAll products after deletion:")
        for prod in db.select_all("products"):
            print(f"ID: {prod['product_id']}, Name: {prod['name']}, Price: {prod['price']}, Stock: {prod['stock_quantity']}")

    print("\nGeneric CRUD operations on existing database complete. Connection closed.")