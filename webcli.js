"use strict";

var escape = require("escape-html"); //Performs HTML encoding
var os     = require("os");          //OS info

module.exports = function(app)
{
    app.post("/api/webcli", function(req, res)
    {
        var result = new CmdResult("Invalid command", false, true);
        try
        {
            var args = getArgs(req.body.cmdLine);        //Split command line into token array
            var cmd  = args[0].toUpperCase();            //1st token is the command name
            result   = _commands[cmd].func(args);        //Run command
        }
        finally
        {
            res.send(result);  //Send result in our response
        }
    });
};

class CmdResult
{
    constructor(output, isHTML, isError)
    {
        this.output  = output  || "";     //Holds the success or error output
        this.isHTML  = isHTML  || false;  //Is the output a text string or an HTML string?
        this.isError = isError || false;  //True if output is an error message
    }
}

function getArgs(cmdLine)
{
    var tokenEx = /[^\s"]+|"[^"]*"/g;   //Matches (1 or more chars that are NOT space or ") or a " any # of chars not a quote, followed by a quote
    var quoteEx = /"/g;                 //Matches "
    var args = cmdLine.match(tokenEx);
    
    //Remove any quotes that may be in the args
    for(var i = 0; i < args.length; i++)
    {
        args[i] = args[i].replace(quoteEx, '');
    }
    return args;
}

var _commands = {}; //Holds the commands
class Command
{
    constructor(help, func)
    {
        this.help = help;  //Help description for the command
        this.func = func;  //Function that implements the command
    }
}

_commands.ECHO = new Command("Echos back the first <token> received", function(args)
{
    if (args.length >=2)
    {
        return new CmdResult(args[1]);    
    }
    return new CmdResult("I didn't hear anything!", false, true);
});

_commands.STATUS = new Command("Displays server status info", function(args)
{
    var freeMem  = Math.floor(os.freemem() / 1024 / 1024);
    var totalMem = Math.floor(os.totalmem() / 1024 / 1024);

    //Calculate uptime in days, hours, minutes
    var upTime  = os.uptime();
    var days    = Math.floor(upTime / 86400);
    var hours   = Math.floor((upTime % 86400) / 3600);
    var minutes = Math.floor(((upTime % 86400) % 3600) / 60);
    upTime = days + "d " + hours + "h " + minutes + "m";

    //Build string
    var s = freeMem + "/" + totalMem + " MB Free :: " + upTime + " up time.";

    return new CmdResult(s);
});

_commands.ADD = new Command("Returns the sum of two numbers", function(args)
{
    if(args.length != 3) { return new CmdResult("Exactly 2 operands required", false, true); }

    var x   = Number(args[1]);
    var y   = Number(args[2]);
    var sum = (x + y).toString();

    return new CmdResult(sum);
});

_commands.HELP = new Command("Lists available commands", function(args)
{
    var s = "<table class='webcli-tbl'>";

    Object.keys(_commands).forEach(function(key)
    {
        var cmd = _commands[key];
        var name = escape(key.toLowerCase());
        s += "<tr><td class='webcli-lbl'>" + name + "</td> <td>:</td> <td class='webcli-val'>"
                                           + escape(cmd.help) + "</td></tr>";
    });
    
    s += "</table>";
    return new CmdResult(s, true);
});



//Client Commands
//------------------------------
_commands.CLS     = new Command("Clears the console");
_commands.YOUTUBE = new Command("Plays a Pluralsight video");
_commands.IMG     = new Command("Displays an image");