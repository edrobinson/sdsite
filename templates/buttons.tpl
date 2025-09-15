{* Button group for editor pages*}
		<style>
			label{
				text-align: right;
			}
			.center{
				width: 40%;
				margin-left: 25%;
			}
		</style>

        <div class="form-actions btn-group center ">
        <button accesskey="I" type="button"   class="btn btn-primary" onclick="handleRequest('insert')"><u>I</u>nsert</button>
        <button accesskey="F" type="button"  class="btn btn-primary" onclick="handleRequest('readfirst')"><u>F</u>irst</button>
        <button accesskey="P" type="button"  class="btn btn-primary" onclick="handleRequest('readprev')"><u>P</u>rev</button>
        <button accesskey="R" type="button"  class="btn btn-primary" onclick="handleRequest('readby')"><u>R</u>ead</button>
        <button accesskey="N" type="button" class="btn btn-primary" onclick="handleRequest('readnext')"><u>N</u>ext</button>
        <button accesskey="s" type="button" class="btn btn-primary" onclick="handleRequest('readlast')">La<u>s</u>t</button>
        <button accesskey="U" type="button" class="btn btn-primary" onclick="handleRequest('update')"><u>U</u>pdate</button>
        <button accesskey="D" type="button" class="btn btn-primary" onclick="handleRequest('delete')">De<u>l</u>ete</button>
        <button accesskey="T" type="button"  class="btn btn-primary" onclick="formReset()">Rese<u>t</u></button>
    </div>
    <br/><br/>
   
