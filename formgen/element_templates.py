#Form for usewith the CRUD system
crudform = """<form class="form" id="form1" name="form1" >
    <input type="hidden" name="opcode"     id="opcode">
    <input type="hidden" name="fields"        id="fields">
    <input type="hidden" name="query"        id="query">
    <input type="hidden" name="validate"     id="vailidate">
    <input type="hidden" name="requireds"  id="requireds">

    <input type="hidden" name="where"        id="where">
    <input type="hidden" name="orderby"     id="orderby">
    <input type="hidden" name="ascdesc"      id="ascdesc">
    <input type="hidden" name="limit"           id="limit">\n"""
    

form = """<form class="form" id="form1" name="form1" >"""

# Template for most of the element types
fieldtpl = """    <div class="form-group row mb-1">
        <label for="[field]" class="col-sm-5 col-form-label">[label]:</label>
        <div class="col-sm-6">
             <input type="[type]" class="form-control" id="[field]" name="[field]"/>
        </div>
    </div>"""

# Template for the textarea
textareatpl = """    <div class="form-group row mb-1">
        <label for="[field]" class="col-sm-5 col-form-label">[label]:</label>
        <div class="col-sm-6">
            <textarea class="form-control" id="[field]" name="[field]" rows="3"></textarea>
        </div>
    </div>"""
