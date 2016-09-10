class WebCLI
{
    constructor()
    {
        var self       = this;
        self.history   = [];   //Command history
        self.cmdOffset = 0;    //Reverse offset into history

        self.createElements();
        self.wireEvents();
        self.showGreeting();
        self.busy(false);
    }

    wireEvents()
    {
        var self = this;

        self.keyDownHandler = function(e) { self.onKeyDown(e); };
        self.clickHandler   = function(e) { self.onClick(e); };

        document.addEventListener('keydown', self.keyDownHandler);
        self.ctrlEl.addEventListener('click', self.clickHandler);
    }

    onClick()
    {
        this.focus();
    }

    onKeyDown(e)
    {
        var self        = this, 
            ctrlStyle   = self.ctrlEl.style;

        //Ctrl + Backquote (Document)
        //http://keycode.info/
        if (e.ctrlKey && (e.keyCode == 192 || e.keyCode == 226))
        {
            if (ctrlStyle.display == "none")
            {
                ctrlStyle.display = "";
                self.focus();
            }
            else
            {
                ctrlStyle.display = "none";
            }
            return;
        }

        if (self.isBusy) { 
            return; 
        }

        //Other keys (when input has focus)
        if (self.inputEl === document.activeElement)
        {
            switch (e.keyCode)  //http://keycode.info/
            {
                case 13: //Enter
                    return self.runCmd();

                case 38: //Up
                    if ((self.history.length + self.cmdOffset) > 0)
                    {
                        self.cmdOffset--;
                        self.inputEl.value = self.history[self.history.length + self.cmdOffset];
                        e.preventDefault();
                    }
                    break;

                case 40: //Down
                    if (self.cmdOffset < -1)
                    {
                        self.cmdOffset++;
                        self.inputEl.value = self.history[self.history.length + self.cmdOffset];
                        e.preventDefault();
                    }
                    break;
            }
        }
    }

    runCmd()
    {
        var self = this, 
            txt  = self.inputEl.value.trim();

        self.cmdOffset = 0;         //Reset history index
        self.inputEl.value = "";    //Clear input
        self.writeLine(txt, "cmd"); //Write cmd to output
        
        if(txt === "") { 
            return; 
        }                           //If empty, stop processing
        
        self.history.push(txt);     //Add cmd to history

        //Client command:
        var tokens = txt.split(" "),
            cmd    = tokens[0].toUpperCase();

        if(cmd === "CLS") { 
            self.outputEl.innerHTML = ""; 
            return; 
        }
        if(cmd === "IMG") { 
            self.writeHTML("<img src='https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'>"); 
            return; 
        }
        if(cmd === "YOUTUBE")
        {
            self.writeHTML('<iframe width="560" height="315" src="https://www.youtube.com/embed/OJRpatLMUuE?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            return;
        }

        //Server command:
        self.busy(true);
        fetch("/api/webcli",
        {
            method: "post",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify({ cmdLine: txt })
        })
        .then(function (r) { return r.json(); })
        .then(function (result)
        {
            var output = result.output;
            var style = result.isError ? "error" : "ok";

            if (result.isHTML)
            {
                self.writeHTML(output);
            }
            else
            {
                self.writeLine(output, style);
                self.newLine();
            }
        })
        .catch(function () { self.writeLine("Error sending request to server", "error"); })
        .then(function ()  //Finally
        {
            self.busy(false);
            self.focus();
        });

        self.inputEl.blur();
    }

    focus()
    {
        this.inputEl.focus();
    }

    scrollToBottom()
    {
        this.ctrlEl.scrollTop = this.ctrlEl.scrollHeight;
    }

    newLine()
    {
        this.outputEl.appendChild(document.createElement("br"));
        this.scrollToBottom();
    }

    writeLine(txt, cssSuffix)
    {
        var span = document.createElement("span");
        cssSuffix = cssSuffix || "ok";
        span.className = "webcli-" + cssSuffix;
        span.innerText = txt;
        this.outputEl.appendChild(span);
        this.newLine();
    }

    writeHTML(markup)
    {
        var div = document.createElement("div");
        div.innerHTML = markup;
        this.outputEl.appendChild(div);
        this.newLine();
    }

    showGreeting()
    {
        this.writeLine("Web CLI [Version 0.0.1]", "cmd");
        this.newLine();
    }

    createElements()
    {
        var self = this, doc = document;
        
        //Create & store CLI elements
        self.ctrlEl   = doc.createElement("div");   //CLI control (outer frame)
        self.outputEl = doc.createElement("div");   //Div holding console output
        self.inputEl  = doc.createElement("input"); //Input control
        self.busyEl   = doc.createElement("div");   //Busy animation
        
        //Add classes
        self.ctrlEl.className   = "webcli";
        self.outputEl.className = "webcli-output";
        self.inputEl.className  = "webcli-input";
        self.busyEl.className   = "webcli-busy";
        
        //Add attribute
        self.inputEl.setAttribute("spellcheck", "false");
        
        //Assemble them
        self.ctrlEl.appendChild(self.outputEl);
        self.ctrlEl.appendChild(self.inputEl);
        self.ctrlEl.appendChild(self.busyEl);
        
        //Hide ctrl & add to DOM
        self.ctrlEl.style.display = "none";
        doc.body.appendChild(self.ctrlEl);
    }

    busy(b)
    {
        this.isBusy                = b;
        this.busyEl.style.display  = b ? "block" : "none";
        this.inputEl.style.display = b ? "none" : "block";
    }
}