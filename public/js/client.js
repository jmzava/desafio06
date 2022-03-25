 window.onload = () => {
    
    const socket = io();


    socket.on('messages', data => {
          loadMessages(data)
        });

    socket.on('products', listProd => {
        loadProds(listProd)
        });

    //---------------------funciones ---------------------

    async function loadProds(listProd) {
        let htmlProd = {}
        const tableList = await fetch('views/partials/table.ejs').then(res => res.text())
        if (listProd.length === 0){
                htmlProd = `No se encontraron Productos`
        }else{
            htmlProd = listProd.map((item, index) =>{
                return (`<tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.price}</td>
                        <td><img src="${item.url}" alt="${item.title}" width="25"></td>
                        </tr>`)
            }).join(" ")
             
        }
        document.getElementById('trTable').innerHTML = htmlProd;
         
    }

    function loadMessages(data) {
        const html = data.map((elem, index) => {
            return(`<div class="direct-chat-info clearfix">
                         <span id="chatName" class="direct-chat-name pull-right">${elem.email}</span> 
                        <span id= "chatDate" class="direct-chat-timestamp pull-left">${elem.date}</span> 
                    </div>
                         <div id="chatText" class="direct-chat-text">${elem.text}</div> 
                     `)
        }).join(" ");
        document.getElementById('messages').innerHTML = html;
    }
    
    function addMessage() {
        
        const newMessage = {
            email: document.getElementById('email').value,
            text: document.getElementById('text').value,
            };

        socket.emit('new-message', newMessage);
    }
    
    document.getElementById('frmPasion').addEventListener('submit', (e) => {
        e.preventDefault()
        addMessage()
    })
    
    document.getElementById('btn').addEventListener('click', () => {

        newprod = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        url: document.getElementById('url').value
        }
        socket.emit('newProd', newprod)
    })


}



//     socket.on('products', async products => {
//         const plantilla = await fetch('views/table.ejs').then(res => res.text())
//         console.log(planitlla)
//         // const template = Handlebars.compile(plantilla)
//         // const html = template({products})

//         // document.getElementById('tabla').innerHTML = html

//     })

// }
    
    
 


