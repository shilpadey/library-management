const Books = require('../models/libraryMagmnt');

exports.getBooks = async (req, res, next) => {
    try {
        const books = await Books.findAll();
        res.json(books);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.postBooks = async (req, res, next) => {
    try {
        const title = req.body.title;
        const dateIssued = req.body.dateIssued;
        const returnDate = req.body.returnDate;
        const returnBook = req.body.returnBook;
        const fine = req.body.fine;

        let book;
            // Book is being issued
            book = await Books.create({
                title,
                dateIssued,
                returnDate,
                returnBook,
                fine,
            });
        

        res.status(201).json({
            book: book
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.returnBooks = async(req, res, next) => {
    
        const id = req.params.id;
        const title = req.body.title;
        const dateIssued = req.body.dateIssued;
        const returnDate = req.body.returnDate;
        const returnBook = req.body.returnBook;
        const fine = req.body.fine;
    
    try{
        const rtnBooks = await Books.findByPk(id);
            
        rtnBooks.title = title;
        rtnBooks.dateIssued = dateIssued;
        rtnBooks.returnDate = returnDate;
        rtnBooks.returnBook = returnBook;
        rtnBooks.fine = fine;
            
        const updatedBooks = await rtnBooks.save();

        console.log('Record Updated');
        res.json(updatedBooks);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
