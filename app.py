''' Flask app file for sharlas site '''

from flask import Flask, request, jsonify, render_template, send_file, Response, session, g, current_app, abort
from flask_session import Session
from flask_cors import CORS 
import json
import sqlite3
import markdown
from src.crud import CRUD
from flask_mail import Mail, Message



app = Flask(__name__)

app.config.from_pyfile('config.py')
mail = Mail(app)
CORS(app)
Session(app)

# Database Handlers by Gemini
#Using sqlite3
def get_db():
    """
    Establishes a database connection for the current context (e.g., Flask request)
    and stores it in `g` for reuse during the request.
    Must be called by any route needing DB services.
    """
    # Use Flask's `g` object to store the connection specific to the current request.
    db = getattr(g, '_database', None)

    if db is None:
        # Connect to the SQLite database file specified in app.config
        db = g._database = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES # Important for correctly parsing dates/times
        )
        # Set row_factory for dictionary-like access to columns
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """
    Closes the database connection at the end of the application context (e.g., after a request).
    This ensures resources are released.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
#End database handlers
#These have to be after the db utils because of the get_db calls in them.
import src.utilities as utils
import src.blogutilities as butils
import src.booksutilities as bookutils


#Admin Page
@app.route("/secret/page")
def admin():
    return render_template('pages/admin.html')    

''' Routes for all of the navbar links '''

@app.route("/")
@app.route("/home")
def homepage():
    session['user'] = "user"
    books  = utils.getBooks() #list of sqlite row objects
    poems = utils.getPoems()
    return render_template('pages/index.html', booklist = books, poemlist = poems)

@app.route("/about")
def about():
    return render_template('pages/about.html')    

@app.route("/booksmgr")
def booksmgr():
    data =  utils.getBooks()
    return render_template('editors/bookseditor.html', bookslist = data)

@app.route("/booktext")
def booktext():
    texttype = request.args.get('type') #Text type - summary or excerpt
    title = request.args.get('title')   #Book title
    title = f'{title} {texttype}' #add the type name
    data = utils.getBookText(title, texttype)
    return jsonify(data)
    
@app.route("/books")
def books():
    data =  utils.getBooks()
    return render_template('pages/books.html', books = data)
    
@app.route("/orderbook/<id>")
def orderbook(id):
    session['bookId'] = id
    data =  utils.getBook(id)
    data['price'] = float(data['price'])
    print(data)
    return render_template('pages/bookorder.html', book = data)
    
@app.route("/ordermgr", methods=['GET', 'POST'])
def ordermgr():
    if request.method == 'GET': #Display the page
        orders = utils.getOrders()
        return render_template('editors/orderseditor.html',  orderlist = orders)
    if request.method == 'POST': #Process an editor request
        data = request.form
        res = butils.processEdits(data)
        return jsonify(res)

@app.route("/showorder/<id>")
def showorder(id):
    return utils.getOrder(id)
    
@app.route("/placebookorder", methods=['POST'])
def placebookorder():
    data = request.json
    book = session.get('bookId')
    msg = utils.placeBookOrder(data, book)
    return jsonify(msg)
    
@app.route("/showbook/<id>")
def showbook(id):
    data = utils.getBook(id)
    return render_template('pages/book.html', book = data)
    
@app.route("/showpoem/<id>")
def showpoem(id):
    data = utils.getPoem(id)
    dta = dict(data[0])
    img = f'{dta['title']}.jpg'
    ptextname = f'{dta['title']}.html'
    #txt = render_template(ptextname) #load the poem text
    return render_template('pages/poem.html', poem = dta)
    
@app.route("/poetry")
def poetry():
    data =  utils.getPoems()
    return render_template('pages/poetry.html', poems = data)
    
@app.route("/poetrymgr", methods=['GET', 'POST'])
def poetrymgr():
    if request.method == 'GET': 
        poems = utils.getPoems()
        return render_template('editors/poemseditor.html', poemslist = poems)
    if request.method == 'POST': #Process an editor request
        data = request.form
        res = butils.processEdits(data)
        return jsonify(res)
        
@app.route("/poemtext/<title>")
def poemtext(title):
    data = utils.getPoemText(title)
    return data
 
@app.route("/prose")
def prose():
    data =  utils.getProse()
    return render_template('pages/prose.html', proselist = data)

@app.route("/getprosearticle/<id>")
def getprosearticle(id):
    print(f'Id sent to getprosearticle: {id}', flush=True)
    return  utils.getProseArticle(id)
     
@app.route("/contact")
def contact():
    return render_template('pages/contact.html', contactEmail = current_app.config['CONTACTEMAIL'])

@app.route("/process-contact", methods=['POST'])
def processcontact():
    data = request.json
    msg = utils.storeContact(data)
    return jsonify(msg)
  
@app.route("/contactmgr", methods=['GET', 'POST'])
def contatctmgr():
    if request.method == 'GET': #Display the page
        contacts = utils.getContacts()
        return render_template('editors/contactseditor.html', contactlist = contacts)
    if request.method == 'POST': #Process an editor request
        data = request.form
        res = butils.processEdits(data)
        return jsonify(res)
    return False
  
@app.route("/blog")
def blog():
    data = butils.getArticles()
    return render_template('pages/blog.html', posts = data)
'''
@app.route("/showarticle/<id>", methods=['GET'])
def showarticle(id):
    return butils.showArticle(id)
'''
@app.route("/showpost/<id>")
def showpost(id):
    return butils.showPost(id)

@app.route("/blogmgr", methods=['GET', 'POST'])
def blogmgr():
    if request.method == 'GET': #Display the page
        posts = utils.getBlogs()
        return render_template('editors/blogeditor.html', postlist = posts)
    if request.method == 'POST': #Process an editor request
        data = request.form
        res = butils.processEdits(data)
        return jsonify(res)

@app.route("/prosemgr", methods=['GET', 'POST'])
def prosemgr():
    if request.method == 'GET': #Display the page
        prose = utils.getProse()
        return render_template('editors/proseeditor.html', proselist = prose)
    if request.method == 'POST': #Process an editor request
        data = request.form
        res = butils.processEdits(data)
        return jsonify(res)

@app.route("/readpost/<id>")
def readpost(id):
    data =  butils.showArticle(id)
    return jsonify(data)
 
#Combined crud op call route to invoke any of the 
#utility crud functions
@app.route("/crud/operation", methods=['POST'])
def crudOperation():
    data = request.json
    params = json.loads(data)
    opcode = params['opcode']
    operations_map = {
            "create": utils.create,
            "read": utils.read,
            "update": utils.update,
            "delete": utils.delete,
        }

    # Get the function reference from the map
    crud_function_to_call = operations_map.get(opcode)
    
    if crud_function_to_call:
        # Call the function through the variable
        result = crud_function_to_call(data)

        if isinstance(result, sqlite3.Row):
            data_to_serialize = dict(result)
        elif isinstance(result, list):
            data_to_serialize = [dict(row) for row in result]
        elif isinstance(result, str):
            data_to_serialize = result
        elif isinstance(result, int):
            data_to_serialize = result
        else:
            print(f'Result received by crud/operation route: {result} {type(result)}')
            return jsonify({"Error": "Unexpected data type from utility function"}), 500
        return jsonify(data_to_serialize), 200
    
@app.route("/send_email", methods=['POST'])
def send_email():
    data = request.get_json()
    msg = Message(
        subject     = data['subject'],
        recipients = [data['recipient']],
        body        = data['msgbody']
    )
    try:
        mail.send(msg)
    except Exception as e:
        return jsonify(f'Mail not sent. Exception: {e}')
    return jsonify('Email sent succesfully!')


@app.route("/help/<page>")
def helpDisplay(page):
    '''
    Display a help page using the core markdown package.
    The page variable is the base name of the page.md file.
    i.e blog.md
    '''
    #Get the page markdown
    pagepath = f'{current_app.config['HELPFOLDER']}/{page}.md'
    with open(pagepath, 'r') as file:
        content = file.read()
        html_content = markdown.markdown(content)
        
    return render_template('pages/help.html', md = html_content, pagename = page.capitalize())
 
@app.route("/navmaint")
def navmaint():
    res = utils.navbarMaint()
    return res
 
@app.route("/biography")
def biography():
    return render_template('pages/biography.html')

@app.route("/photos")
def photos():
    return render_template('pages/photos.html')

@app.route("/faqmgr")
def faqmgr():
    data = utils.getFAQs()
    return render_template('editors/faqeditor.html', faqlist = data)

@app.route("/faqs")
def faqs():
    data = utils.getFAQs()
    return render_template('pages/faqs.html', faqlist = data)
    
@app.route("/poetryformatter")
def poetryformatter():
    return render_template('editors/poetrytextgen.html')
    
@app.route("/lps/<page>")
def lps(page):
    url = f'pages/lps{page}.html'
    return render_template(url)
    
    