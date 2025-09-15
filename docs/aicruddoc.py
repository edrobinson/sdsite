'''
This py contains examples for the aicrud.py class
'''           
if __name__ == '__main__':
    # Replace with your actual database credentials.
    # It's best to store these in environment variables or a separate
    # configuration file, rather than hardcoding them in your script.
    db_config = {
        'host': 'localhost',
        'user': 'your_user',
        'password': 'your_password',
        'database': 'your_database',
        'port': 3306,  # Or the port your MySQL server is listening on.
    }

    try:
        # Create an instance of the MySQLCRUD class.
        crud_service = MySQLCRUD(**db_config)

        # 1. Create (Insert) a new user.
        new_user = {'name': 'Alice Smith', 'email': 'alice.smith@example.com'}
        new_user_id = crud_service.create('users', new_user)
        print(f"Created new user with ID: {new_user_id}")  # Output: Created new user with ID: 1

        # 2. Read (Select) one user by ID.
        user_alice = crud_service.read_one('users', 'id = %s', (new_user_id,))
        print(f"Read user Alice: {user_alice}")
        # Output: Read user Alice: {'id': 1, 'name': 'Alice Smith', 'email': 'alice.smith@example.com'}

        # 3. Read (Select) all users.
        all_users = crud_service.read_all('users')
        print(f"All users: {all_users}")
        # Output: All users: [{'id': 1, 'name': 'Alice Smith', 'email': 'alice.smith@example.com'}]

        # 4. Read all users, ordered by name
        all_users_ordered = crud_service.read_all('users', order_by='name ASC')
        print(f"All users ordered by name: {all_users_ordered}")

        # 5. Read a limited number of users
        limited_users = crud_service.read_all('users', limit=1)
        print(f"Limited users: {limited_users}")

        # 6. Read users with limit and offset (for pagination)
        paginated_users = crud_service.read_all('users', limit=1, offset=0)
        print(f"Paginated users (page 1): {paginated_users}")

        # 7. Update (Modify) a user's email.
        updated_data = {'email': 'alice.smith.updated@example.com'}
        updated_rows = crud_service.update('users', updated_data, 'id = %s', (new_user_id,))
        print(f"Updated {updated_rows} user(s)")  # Output: Updated 1 user(s)

        # 8. Read the updated user to verify the update.
        updated_user_alice = crud_service.read_one('users', 'id = %s', (new_user_id,))
        print(f"Updated Alice: {updated_user_alice}")
        # Output: Updated Alice: {'id': 1, 'name': 'Alice Smith', 'email': 'alice.smith.updated@example.com'}

        # 9. Delete (Remove) the user.
        deleted_rows = crud_service.delete('users', 'id = %s', (new_user_id,))
        print(f"Deleted {deleted_rows} user(s)")  # Output: Deleted 1 user(s)

        # 10. Attempt to read the deleted user (should return None).
        deleted_user_alice = crud_service.read_one('users', 'id = %s', (new_user_id,))
        print(f"Deleted Alice (should be None): {deleted_user_alice}")  # Output: Deleted Alice (should be None): None

        # 11. Example of using execute_query for a non-standard query (e.g., counting users).
        count_query = "SELECT COUNT(*) AS user_count FROM users"
        user_count_result = crud_service.execute_query(count_query, fetch=True)
        print(f"User count: {user_count_result[0]['user_count']}")

        # 12.  Example of using execute query with a parameter.
        email_query = "SELECT * FROM users WHERE email = %s"
        email_to_find = "alice.smith.updated@example.com"
        user_by_email = crud_service.execute_query(email_query, (email_to_find,), fetch=True)
        print(f"User by Email: {user_by_email}")

    except Exception as e:
        # Catch any exceptions that occurred during the process.  This could be
        # a database error, or an error in the application code.
        print(f"An error occurred: {e}")
