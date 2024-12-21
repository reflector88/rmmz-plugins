
## Reference Tables

There are many different tags to annotate parameters.

#### Base Tags

|Tag     | Function                                                                 
|-------:|--------------------------------------------------------------:|
|@param  | Defines new parameter. Used as name if @text is not defined.             
|@type   | Specifies parameter's type.                                             
|@default| Default value of the parameter.
|@text   | Name to use in place of the parameter name.     
|@desc   |                                  
|@parent | Indents the parameter below a parent parameter.                         


#### Types

|Type            | Description                                         
|---------------:|----------------------------------------------------:|
|string          | A string of characters. Default when unspecified.   
|multiline_string|
|number          | An integer.										  
|boolean         | True or false.                                      
|select          | Opens a dropdown of predefined options (see `@option`)
|switch          |
|variable        |
|file            | Opens a dropdown to select a file.
|actor           | Opens window to select an actor.
|class           |
|skill           |
|item            |
|weapon          |
|armor           |
|enemy           |
|troop           |
|state           |
|animation       | Opens window to select an animation.
|common_event    |
|tileset         |               
|x[]             | An arbitrary number of type x. Outputs as an array. 
|struct<>        | An object that contains parameters.      

#### Type-Specific Tags

|Tag     | Function                                                                 
|-------:|--------------------------------------------------------------:|
|@min    |
|@max    |
|@decimals|
|@on     |
|@off    |
|@option | Used with the `@select` type to denote one of several options
|@value  | Used with `@option`. Specifies the actual value of the option.          
|@dir    | Used with **file** type to narrow the directory.                                