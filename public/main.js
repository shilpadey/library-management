

//display books on the webpage
document.addEventListener('DOMContentLoaded', async() => {
    try {
        await displayBooks();
    } catch (error) {
        console.log("Error fetching books: ", error);
    }
});


//function to issue or return book
async function bookIssued(event){
    event.preventDefault();

    let title = document.getElementById('title').value;
    let fine = 0;

    let currDate = new Date()
    let dateIssued = currDate.toISOString();
    currDate.setHours(currDate.getHours()+1);

    let returnDate = currDate.toISOString();
    let returnBook = document.getElementById('returnBook').value;

    let obj = {
        title, dateIssued, returnDate, returnBook, fine
    };

    try{
        // Add the book to the database
        const result = await axios.post("http://localhost:3000/add-books", obj);
        
        // Fetch and display the updated list of books
        await displayBooks();
    } catch {
        console.log("Books issuing has some error");
    }
}

function calculatingFine(dateIssued, returnDate , fine){
    let Idate = new Date(dateIssued);
    let Rdate = new Date(returnDate);
    console.log(Idate, Rdate);

    //calculating the difference with milliseconds
    const diffMilliSec = Rdate - Idate;

    //convert milliseconds into hours
    const diffHours = diffMilliSec/(1000*60*60);

    console.log(diffHours);

    // Check if the book is returned after one hour
    if (diffHours > 1) {
        // Book is returned after one hour, apply a fine of 370 rs
        return fine + 370;
    } else {
        // Book is returned within one hour, no fine
        return fine;
    }
};

async function displayBooks() {
    try {
        const res = await axios.get("http://localhost:3000/get-books");
        console.log(res.data);

        const bookTaken = document.getElementById("bookTaken");
        const bookReturned = document.getElementById("bookReturned");

        bookTaken.innerHTML = ""; // Clear the existing content
        bookReturned.innerHTML = ""; // Clear the existing content

        for (let i = 0; i < res.data.length; i++) {
            showOnScreen(res.data[i], bookTaken, bookReturned);
        }
    } catch (error) {
        console.log("Error fetching books: ", error);
    }
}


// display the content on the webpage
function showOnScreen(obj, bookTaken, bookReturned) {
    const bookStatus = obj.returnBook === 'incomplete' ? 'taken' : 'returned';

    let currentDate = new Date().toISOString();

    const childNode = document.createElement('li');
    childNode.textContent = `${obj.title}  ${obj.dateIssued}  ${obj.returnDate}  ${obj.fine}`;

    let returnBtn = document.createElement('input');
    returnBtn.value = 'Return Book';
    returnBtn.type = 'button';

    if (bookStatus === 'taken') {
        bookTaken.appendChild(childNode);
        childNode.append(returnBtn);

        returnBtn.onclick = async () => {
            // Calculate fine if needed
            const fine = calculatingFine(obj.dateIssued, currentDate, obj.fine);

            // Update the database to mark the book as returned
            try {
                await axios.patch(`http://localhost:3000/edit/${obj.id}`, {
                    title: obj.title,
                    dateIssued: obj.dateIssued,
                    returnDate: currentDate, // Set returnDate to the current date
                    returnBook: 'complete', // Mark as returned
                    fine: fine,
                });

                // Update the UI to move the book to "bookReturned"
                bookTaken.removeChild(childNode);
                // Display the book immediately in the 'bookReturned' list
                let childNode2 = document.createElement('li');
                childNode2.textContent = `${obj.title} ${fine > 0 ? 'Fine: ' + fine + ' rs' : 'No fine'}`;
                bookReturned.appendChild(childNode2);
            } catch (error) {
                console.log("Error updating database:", error);
            }
        };
    } else {
        // If the book is already returned, display it in the 'bookReturned' list
        let childNode2 = document.createElement('li');
        childNode2.textContent = `${obj.title} ${obj.fine > 0 ? 'Fine: ' + obj.fine + ' rs' : 'No fine'}`;
        bookReturned.appendChild(childNode2);
    }
}

