import psycopg2
from psycopg2 import Error

def connect_to_db(db_name, user, password, host, port):
    """Establishes a connection to the PostgreSQL database."""
    conn = None
    try:
        conn = psycopg2.connect(
            database=db_name,
            user=user,
            password=password,
            host=host,
            port=port
        )
        print("Connection to PostgreSQL DB successful!")
        return conn
    except Error as e:
        print(f"Error connecting to PostgreSQL DB: {e}")
        return None

def create_table(conn):
    """Creates a sample table if it doesn't exist."""
    try:
        cursor = conn.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            age INT
        );
        """
        cursor.execute(create_table_query)
        conn.commit()
        print("Table 'users' created successfully or already exists.")
    except Error as e:
        print(f"Error creating table: {e}")
    finally:
        if cursor:
            cursor.close()

def insert_user(conn, name, email, age):
    """Inserts a new user into the 'users' table."""
    try:
        cursor = conn.cursor()
        insert_query = """
        INSERT INTO users (name, email, age)
        VALUES (%s, %s, %s) RETURNING id;
        """
        cursor.execute(insert_query, (name, email, age))
        user_id = cursor.fetchone()[0]
        conn.commit()
        print(f"User '{name}' inserted with ID: {user_id}")
        return user_id
    except Error as e:
        print(f"Error inserting user: {e}")
        conn.rollback() # Rollback changes on error
        return None
    finally:
        if cursor:
            cursor.close()

def get_all_users(conn):
    """Fetches all users from the 'users' table."""
    try:
        cursor = conn.cursor()
        select_query = "SELECT id, name, email, age FROM users;"
        cursor.execute(select_query)
        users = cursor.fetchall()
        print("\n--- All Users ---")
        if users:
            for user in users:
                print(f"ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Age: {user[3]}")
        else:
            print("No users found.")
        return users
    except Error as e:
        print(f"Error fetching users: {e}")
        return []
    finally:
        if cursor:
            cursor.close()

def get_user_by_id(conn, user_id):
    """Fetches a single user by their ID."""
    try:
        cursor = conn.cursor()
        select_query = "SELECT id, name, email, age FROM users WHERE id = %s;"
        cursor.execute(select_query, (user_id,))
        user = cursor.fetchone()
        if user:
            print(f"\n--- User with ID {user_id} ---")
            print(f"ID: {user[0]}, Name: {user[1]}, Email: {user[2]}, Age: {user[3]}")
        else:
            print(f"\nNo user found with ID: {user_id}")
        return user
    except Error as e:
        print(f"Error fetching user by ID: {e}")
        return None
    finally:
        if cursor:
            cursor.close()

def update_user_email(conn, user_id, new_email):
    """Updates the email of a user."""
    try:
        cursor = conn.cursor()
        update_query = "UPDATE users SET email = %s WHERE id = %s;"
        cursor.execute(update_query, (new_email, user_id))
        conn.commit()
        if cursor.rowcount > 0:
            print(f"User with ID {user_id} email updated to '{new_email}'.")
        else:
            print(f"No user found with ID {user_id} to update.")
    except Error as e:
        print(f"Error updating user email: {e}")
        conn.rollback()
    finally:
        if cursor:
            cursor.close()

def delete_user(conn, user_id):
    """Deletes a user from the 'users' table."""
    try:
        cursor = conn.cursor()
        delete_query = "DELETE FROM users WHERE id = %s;"
        cursor.execute(delete_query, (user_id,))
        conn.commit()
        if cursor.rowcount > 0:
            print(f"User with ID {user_id} deleted successfully.")
        else:
            print(f"No user found with ID {user_id} to delete.")
    except Error as e:
        print(f"Error deleting user: {e}")
        conn.rollback()
    finally:
        if cursor:
            cursor.close()

def close_connection(conn):
    """Closes the database connection."""
    if conn:
        conn.close()
        print("PostgreSQL connection closed.")

if __name__ == "__main__":
    # --- Database Configuration ---
    DB_NAME = "your_database_name"  # Replace with your PostgreSQL database name
    DB_USER = "your_username"       # Replace with your PostgreSQL username
    DB_PASSWORD = "your_password"   # Replace with your PostgreSQL password
    DB_HOST = "localhost"           # Or the IP/hostname of your PostgreSQL server
    DB_PORT = "5432"                # Default PostgreSQL port

    # 1. Connect to the database
    connection = connect_to_db(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)

    if connection:
        # 2. Create the table
        create_table(connection)

        # 3. Insert users
        user1_id = insert_user(connection, "Alice Smith", "alice.smith@example.com", 30)
        user2_id = insert_user(connection, "Bob Johnson", "bob.johnson@example.com", 25)
        user3_id = insert_user(connection, "Charlie Brown", "charlie.brown@example.com", 35)
        # Attempt to insert a user with a duplicate email (will cause an error)
        insert_user(connection, "Alice Dupe", "alice.smith@example.com", 40)

        # 4. Get all users
        get_all_users(connection)

        # 5. Get a specific user by ID
        if user1_id:
            get_user_by_id(connection, user1_id)
        get_user_by_id(connection, 9999) # Non-existent ID

        # 6. Update a user's email
        if user2_id:
            update_user_email(connection, user2_id, "robert.johnson@example.com")
            get_user_by_id(connection, user2_id) # Verify update

        # 7. Delete a user
        if user3_id:
            delete_user(connection, user3_id)
            get_all_users(connection) # Verify deletion

        # 8. Close the connection
        close_connection(connection)
    else:
        print("Could not establish a database connection. Exiting.")