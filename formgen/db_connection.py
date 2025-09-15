import pymysql.cursors


def connectToDb():
    print("Connecting to Database . . .")
    db = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="sddb",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )
    return db
