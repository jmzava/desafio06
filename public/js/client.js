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
        let htmlProd = ""
        const tableList = await fetch('views/partials/table.ejs').then(res => res.text())
 
        if (listProd.length === 0){
            htmlProd = `No se encontraron Productos`
        }else{
            htmlProd = ejs.render(tableList, {listProd})
     
        }
         document.getElementById('NuevaTabla').innerHTML = htmlProd;
         
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

        const newprod = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        url: document.getElementById('url').value
        }
        socket.emit('newProd', newprod)
    })


}

    
 


