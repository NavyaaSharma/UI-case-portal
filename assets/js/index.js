function register()
{
    var data=
    {
    "name":document.getElementById('uname').value,
	"email":document.getElementById('email').value,
	"password":document.getElementById('pass').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/admin/create", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==201)
        {
            alert('registered successfully! Login to continue')
            window.location.replace('login.html')
        }
        else{
            alert('Failed! Try again')
            window.location.replace('signup.html')
        }
}
}

function login()
{
    var data=
    {
	"email":document.getElementById('email').value,
	"password":document.getElementById('pass').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/admin/login", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            localStorage.setItem("JWT_Token", "JWT " + data.token)
            window.location.replace('index.html')
        }
        else{
            alert('Invalid login credentials')
            window.location.replace('login.html')
        }
}
}

function searchcase()
{
    var data={
        "phone":document.getElementById('searchbox').value
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/adv/details", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            for(var i=0;i<data.payload.length;i++)
            {
                $('#dispcase').append(`<a href="case.html?id=${data.payload[i].case_no}" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">Case Name: <span>${data.payload[i].name}</span></h4>
                <h6>${data.payload[i].party.party1} v/s ${data.payload[i].party.party2}</h6>
            </a>`)
            }
        }
        else if(this.status==404)
        {
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO CASE FOUND</h4>
            </a>`)
        }
        else{
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </a>`)
        }
    }
}

function details()
{
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const cid = urlParams.get('id')
    var data={
        "case_no":cid
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/adv/moredetails", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            document.getElementById('name').innerHTML=data.user.name
            document.getElementById('party').innerHTML=data.user.party.party1+ " vs "+data.user.party.party2
            document.getElementById('desc').innerHTML=data.user.desc
            document.getElementById('judge').innerHTML=data.user.judge
            document.getElementById('ename').value=data.user.name
            document.getElementById('ep1').value=data.user.party.party1
            document.getElementById('ep2').value=data.user.party.party2
            document.getElementById('edesc').value=data.user.desc
            document.getElementById('ejudge').value=data.user.judge
            document.getElementById('cno').innerHTML=data.user.case_no
            if(data.user.date.length!=0)
            {
                for(var i=0;i<data.user.date.length;i++)
                {
                    $('#dates').append(`<div class="card">
                    <div class="card-header" id="date${i+1}" type="button" data-toggle="collapse" data-target="#data${i+1}" aria-expanded="true" aria-controls="data${i+1}">
                        <i class="fa fa-plus"></i> <span id="date${data.user.date[i]._id}">${data.user.date[i].date}</span>                       
                    </div>
                    <div id="data${i+1}" class="card-body collapse" aria-labelledby="date${i+1}" data-parent="#dates">
                        <button class="btn btn-dark m-2" data-toggle="modal" data-target="#editDate" data-date="date${i+1}" name="${data.user.date[i]._id}" onclick="middle(this.name)">Edit Details</button>
                        <h5>Time: <span id="time${data.user.date[i]._id}">${data.user.date[i].time}</span></h5>
                        <h5>Details: <span id="det${data.user.date[i]._id}">${data.user.date[i].details}</span></h5>
                        <h5>Message For Client: <span id="msg${data.user.date[i]._id}">${data.user.date[i].msg}</span></h5>
                        <h5>Important Documents: <form method="POST" enctype="multipart/form-data">
                        <div class="form-group">
                          <label for="example-input-file"> </label>
                          <input type="file" name="multi-files" multiple id="input-multi-files" class="form-control-file border"/>
                        </div>
                        <button type="submit" class="btn btn-primary" onclick="addDoc(${data.user.case_no})">Submit</button>
                      </form> </h5>
                        <div class="accordion" id="docs${i+1}">
                            <div class="card">
                                <div class="card-header" id="docs${i+1}-1" type="button" data-toggle="collapse" data-target="#docd${i+1}-1" aria-expanded="true" aria-controls="docs${i+1}-1">
                                    <i class="fa fa-plus"></i> Document 1                        
                                </div>
                                <div id="docd${i+1}-1" class="card-body collapse" aria-labelledby="docs${i+1}-1" data-parent="#docs${i+1}">
                                    Hello
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header" id="docs${i+1}-2" type="button" data-toggle="collapse" data-target="#docd${i+1}-2" aria-expanded="true" aria-controls="docs${i+1}-2">
                                    <i class="fa fa-plus"></i> Document 1                        
                                </div>
                                <div id="docd${i+1}-2" class="card-body collapse" aria-labelledby="docs${i+1}-2" data-parent="#docs${i+1}">
                                    Document
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`)
                }
            }
            else{
                $('#dates').append(`<div class="card">
                    <div class="card-header" id="date1" type="button" data-toggle="collapse" data-target="#data1" aria-expanded="true" aria-controls="data1">
                        <i class="fa fa-plus"></i> No date history found                      
                    </div>`)
            }
        }
        else if(this.status==404)
        {
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO CASE FOUND</h4>
            </a>`)
        }
        else{
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </a>`)
        }
    }
}

function addDate()
{
    var data={
        "case_no":document.getElementById('cno').innerHTML,
        "date_details":{
            "date":document.getElementById('adate').value,
            "time":document.getElementById('atime').value,
            "details":document.getElementById('adetails').value,
            "msg":document.getElementById('amsg').value
        }    
    }
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/adv/add-date", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==201)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            alert('Date added successfully!')
            window.location.reload()
            
        }
        else{
            alert('Failed to add a date! Try again')
            window.location.reload()
        }
    }

}

function editCase()
{
    var data={
        "name":document.getElementById('ename').value,
        "judge":document.getElementById('ejudge').value,
        "party":{
            "party1":document.getElementById('ep1').value,
            "party2":document.getElementById('ep2').value
        },
        "desc":document.getElementById('edesc').value
    }
    var cno=document.getElementById('cno').innerHTML
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", `http://localhost:3000/adv/update/case/details?case_no=${cno}`, true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            alert('Upadted successfully!')
            window.location.reload()
            
        }
        else{
            alert('Failed to update! Try again')
            window.location.reload()
        }
    }
}

function middle(date_id)
{
    document.getElementById('ucd').value=document.getElementById('date'+date_id).innerHTML
    document.getElementById('utime').value=document.getElementById('time'+date_id).innerHTML
    document.getElementById('umsg').value=document.getElementById('msg'+date_id).innerHTML
    document.getElementById('udet').value=document.getElementById('det'+date_id).innerHTML
    document.getElementById('did').innerHTML=date_id
}
function editDate()
{

    var data={
        "date":document.getElementById('ucd').value,
        "details":document.getElementById('udet').value,
        "time":document.getElementById('utime').value,
        "msg":document.getElementById('umsg').value
    }
    var cno=document.getElementById('cno').innerHTML
    var date_id=document.getElementById('did').innerHTML
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", `http://localhost:3000/adv/update/case/date?case_no=${cno}&date_id=${date_id}`, true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            alert('Upadted successfully!')
            window.location.reload()
            
        }
        else{
            alert('Failed to update! Try again')
            window.location.reload()
        }
    }
}

function addCase()
{
    var data={
        "case_no":document.getElementById('cno').value,
        "name":document.getElementById('name').value,
        "phone":document.getElementById('phone').value,
        "judge":document.getElementById('judge').value,
        "desc":document.getElementById('desc').value,
        "party":
        {
            "party1":document.getElementById('p1').value,
            "party2":document.getElementById('p2').value
        }
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/adv/add-case", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==201)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            alert('Case added successfully!')
            window.location.replace('index.html')
            
        }
        else{
            alert('Failed to add a date! Try again')
            window.location.reload()
        }
    }

}

function count()
{
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("GET", "http://localhost:3000/adv/count", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            document.getElementById('getcase').innerHTML=data.total
            
        }
        else{
            document.getElementById('getcase').innerHTML="Unable to display"
        }
    }
}
