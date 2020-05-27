// Book Class: Represents a Book
class Book{
	constructor(title,author,isbn){
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}
//UI Class: Handle UI Class
class UI {
	static displayBooks(){

		const books = Store.getBooks();

		books.forEach((book) => UI.addBookList(book)); //book is an instance of Book class insatntiated in 'Event: Add Book' dowm
	}
	
	static addBookList(book){
		const list = document.querySelector('#book-list');

		const row  = document.createElement('tr')  

		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href = '#' class = "btn btn-danger btn-sm delete">X</a></td>
		`;
		    list.appendChild(row)
	}	

	static deleteBook(el) {
		if(el.classList.contains('delete')){
			el.parentElement.parentElement.remove();
		}
	}

	

	static showAlert(message,className){
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector(' .container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div,form);
		// Vanish in .5 seconds
		setTimeout(() => document.querySelector('.alert').remove(),500);
	}

	static clearFields(){
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	
	}
}
//Store Class: Handles Storage

class Store{
	static getBooks(){               //initialized the methods with static so that not to instantiate Store Class
		let books;
		if(localStorage.getItem('books') === null){
			books = []
		}else{
			books = JSON.parse(localStorage.getItem('books'));
		}

		return books;
	}

	static addBook(book){
		const books = Store.getBooks();

		books.push(book);

		localStorage.setItem('books',JSON.stringify(books)); // key-> books value->stringified books


	}
	static removeBook(isbn){
		const books = Store.getBooks();

		books.forEach((book,index) => {
			if(book.isbn === isbn){
				books.splice(index,1)
			}
		});

		localStorage.setItem('books',JSON.stringify(books));
	}
}

//Event: Display Books

document.addEventListener('DOMContentLoaded',UI.displayBooks);//start of the script

//Event: Add a Book 
document.querySelector('#book-form').addEventListener('submit',(e) => { //e is the  icon which is clicked
		//Prevent actual submit
		e.preventDefault();
 		//Get form values
 		const title = document.querySelector('#title').value;
 		const author = document.querySelector('#author').value;
 		const isbn = document.querySelector('#isbn').value;

 		//Validate
 		if(title === '' || author === '' || isbn === ''){
 			UI.showAlert('Please fill in all the fields','danger');
 		} else{
	 		//Instantiate book
	 		const book = new Book(title,author,isbn);

	 		//Add Book
	 		UI.addBookList(book)

	 		//Add book to store
	 		Store.addBook(book)

	 		// Show success message
	 		UI.showAlert('Book Added','success')

	 		//Clear fields from the input fields for the next set of inputs.
	 		UI.clearFields()
 	}
});
//Event: Remove a book
document.querySelector('#book-list').addEventListener('click',(e) => {
		
		//Remove book from UI
		UI.deleteBook(e.target)

		//Remove book from store
		Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

		// Show success message
 		UI.showAlert('Book Removed','success')
	});