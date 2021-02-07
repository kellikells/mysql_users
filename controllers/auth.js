exports.register = (req, res) => {

    // grabbing all the data from the form 
    console.log(req.body);
    
    res.send("Form Submitted");
    
}