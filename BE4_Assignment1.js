const express = require("express");
const app = express();

const { initializeDatabase } = require("./models/DB/DB.Connection")
const Books = require("./models/books.models")

app.use(express.json());
initializeDatabase();

//API with route "/books" to create a new book data in the books Database
async function createNewBook(newBook){
    try{
      const book = new Books(newBook);
      const saveBook = await book.save()
      return saveBook
    } catch (error){
        console.log(error)
    }
}

app.post("/books", async(req, res) => {
    try{
      const savedBook = await createNewBook(req.body)
      res.status(201).json({message: "Book added successfully", book: savedBook})
    } catch (error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to get all the books in the database
async function readAllBooks(){
    try{
      const allBooks = await Books.find();
      return allBooks
    }catch(error){
        console.log(error)
    }
}

app.get("/books", async(req, res) => {
    try{
     const book = await readAllBooks();
     if(book){
        res.json(book)
     }else {
        res.status(404).json({error: "Book not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

// API to get a book's detail by its title.

async function readBookByTitle(bookTitle) {
    try{
     const bookByTitle = await Books.findOne({title: bookTitle});
     return bookByTitle;
    }catch(error){
        console.log(error)
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try{
     const book = await readBookByTitle(req.params.bookTitle);
     if(book){
        res.json(book)
     }else{
        res.status(404).json({error: "Book not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to get details of all the books by an author.

async function readBookByAuthor(authorName) {
    try{
     const authorByName = await Books.findOne({author: authorName})
     return authorByName
    }catch(error){
        console.log(error)
    }
}

app.get("/books/author/:authorName", async(req, res) => {
    try{
     const book = await readBookByAuthor(req.params.authorName)
     if(book){
        res.json(book)
     }else {
        res.status(404).json({error: "Author not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to get all the books which are of "Business" genre.

async function readBookByGenre(bookGenre) {
    try{
      const bookByGenre = await Books.find({genre: bookGenre})
      return bookByGenre
    }catch(error){
        console.log(error)
    }
}

app.get("/books/genre/:bookGenre", async(req, res) => {
    try{
     const book = await readBookByGenre(req.params.bookGenre)
     if(book.length != 0){
        res.json(book)
     }else{
        res.status(404).json({error: "Book not found."})
     }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to get all the books which was released in the year 2012.

async function readBookByReleaseYear(bookPublishedYear) {
    try{
     const bookYear = await Books.find({publishedYear: Number(bookPublishedYear)})
     return bookYear
    }catch(error){
        console.log(error)
    }
}

app.get("/books/publishedYear/:bookPublishedYear", async(req, res) => {
    try{
      const book = await readBookByReleaseYear(req.params.bookPublishedYear)
      if(book.length != 0){
        res.json(book)
      }else{
        res.status(404).json({error: "Book not found."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to update a book's rating with the help of its id.

async function updateBookRating(bookId, dataToUpdate) {
    try{
     const updateBook = await Books.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
     return updateBook
    }catch(error){
        console.log(error)
    }
}

app.post("/books/:bookId", async(req, res) => {
    try{
     const updatedRating = await updateBookRating(req.params.bookId, req.body)
     if(updatedRating){
       res.status(200).json({message: "Rating Updated Successfully.", rating: updatedRating})
     }else{
        res.status(404).json({error: "Book not found."})
     }
     
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to update a book's rating with the help of its title.
async function updateBookByTitle(booksTitle, dataToUpdate) {
    try{
      const updatedBookTitle = await Books.findOneAndUpdate({title:booksTitle}, dataToUpdate, {new: true})
      return updatedBookTitle;
    }catch(error){
        console.log(error)
    }
}

app.post("/books/title/:booksTitle", async(req, res) => {
    try{
      const bookRating = await updateBookByTitle(req.params.booksTitle, req.body)
      if(bookRating){
        res.status(200).json({message: "Rating updated successfully.", book: bookRating})
      }else{
        res.status(404).json({error: "Book does not exist."})
      }
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

//API to delete a book with the help of a book id.
async function deleteBook(booksId) {
    try{
        const deletedBook = await Books.findByIdAndDelete(booksId)
    return deletedBook
    }catch(error){
        console.log(error)
    }
}

app.delete("/books/:booksId", async(req, res) => {
    try{ 
      const deleteBooks = await deleteBook(req.params.booksId)
      res.status(200).json({message: "Book deleted successfully.", book: deleteBooks})
    }catch(error){
        res.status(500).json({error: "Failed to fetch book."})
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});