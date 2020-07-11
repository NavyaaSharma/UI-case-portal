function validatecase()
{
    if(document.getElementById('cno').value && document.getElementById('name').value && document.getElementById('phone').value && document.getElementById('mail').value && document.getElementById('judge').value && document.getElementById('desc').value && document.getElementById('p1').value && document.getElementById('p2').value)
    {
        addCase()
    }
    else
    {
        alert('Please fill all details to add a new case!')
    }
}

function validate1()
{
    if(document.getElementById('uname').value && document.getElementById('email').value && document.getElementById('pass').value)
    {
        register()
    }
    else
    {
        alert('Please fill complete details to register!')
    }
}

function validate2()
{
    if(document.getElementById('pass').value && document.getElementById('email').value)
    {
        login()
    }
    else
    {
        alert('Please fill complete details to login!')
    }
}

function register()
{
    var data=
    {
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
    xh.open("POST", "https://case-manger.herokuapp.com/adv/details", true)
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
        else if(this.status==403)
        {
            localStorage.removeItem('user')
            localStorage.removeItem('JWT_Token')
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
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

function uc1()
{
    var days=1
            var date = new Date();
            var last = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var day =(last.getDate()).toString();
            var month=(last.getMonth()+1).toString();
            var year=last.getFullYear().toString();
            if(day.length==1)
            {
                day="0"+day
            }
            if(month.length==1)
            {
                month="0"+month
            }
            var checkDate=day+"-"+month+"-"+year
        console.log(checkDate)
    // console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("GET", "https://case-manger.herokuapp.com/adv/allCases", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var ctr=0
            var data = JSON.parse(this.responseText)
            console.log(data)
            for(var i=0;i<data.payload.length;i++)
            {
                for(var j=0;j<data.payload[i].date.length;j++)
                {
                    if(data.payload[i].date[j].date==checkDate)
                    {
                        ctr=ctr+1
                        $('#dispcase1').append(`<div class="card col-10 col-md-6 m-1">
                        <h4 class="card-title">Case Name: <span id="cn${data.payload[i]._id}">${data.payload[i].name}</span></h4>
                        <h5>Date of hearing: <span id="d${data.payload[i]._id}">${data.payload[i].date[j].date}</span></h5>
                        <h6>${data.payload[i].party.party1} v/s ${data.payload[i].party.party2}</h6>
                        <p id="j${data.payload[i]._id}" hidden>${data.payload[i].judge}</p>
                        <p id="t${data.payload[i]._id}" hidden>${data.payload[i].date[j].time}</p>
                        <p id="e${data.payload[i]._id}" hidden>${data.payload[i].email}</p>
                        <p id="c${data.payload[i]._id}" hidden>${data.payload[i].venue}</p>
                        <button class="btn btn-dark m-2 float-right" name="${data.payload[i]._id}" onclick="reminder(this.name)">Send Reminder</button>
                    </div>`)
                    }
                }
                
            }
            if(ctr==0)
            {
                $('#dispcase1').append(`<div class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO UPCOMING CASES</h4>
            </div>`)
            }
        }
        else if(this.status==403)
        {
            localStorage.removeItem('user')
            localStorage.removeItem('JWT_Token')
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
        }
        else{
            $('#dispcase1').append(`<div class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </div>`)
        }
    }
}

function uc2()
{
    var days=5
            var date = new Date();
            var last = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var day =(last.getDate()).toString();
            var month=(last.getMonth()+1).toString();
            var year=last.getFullYear().toString();
            if(day.length==1)
            {
                day="0"+day
            }
            if(month.length==1)
            {
                month="0"+month
            }
            var checkDate=day+"-"+month+"-"+year
        console.log(checkDate)
    // console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    var xh = new XMLHttpRequest();
    xh.open("GET", "https://case-manger.herokuapp.com/adv/allCases", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var ctr=0
            var data = JSON.parse(this.responseText)
            console.log(data)
            for(var i=0;i<data.payload.length;i++)
            {
                for(var j=0;j<data.payload[i].date.length;j++)
                {
                    if(data.payload[i].date[j].date==checkDate)
                    {
                        ctr=ctr+1
                        $('#dispcase2').append(`<div class="card col-10 col-md-6 m-1">
                        <h4 class="card-title">Case Name: <span id="cn${data.payload[i]._id}">${data.payload[i].name}</span></h4>
                        <h5>Date of hearing: <span id="d${data.payload[i]._id}">${data.payload[i].date[j].date}</span></h5>
                        <h6>${data.payload[i].party.party1} v/s ${data.payload[i].party.party2}</h6>
                        <p id="j${data.payload[i]._id}" hidden>${data.payload[i].judge}</p>
                        <p id="t${data.payload[i]._id}" hidden>${data.payload[i].date[j].time}</p>
                        <p id="e${data.payload[i]._id}" hidden>${data.payload[i].email}</p>
                        <p id="c${data.payload[i]._id}" hidden>${data.payload[i].venue}</p>
                        <button class="btn btn-dark m-2 float-right" name="${data.payload[i]._id}" onclick="reminder(this.name)">Send Reminder</button>
                    </div>`)
                    }
                }
                
            }
            if(ctr==0)
            {
                $('#dispcase2').append(`<div class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO UPCOMING CASES</h4>
            </div>`)
            }
        }
        else{
            $('#dispcase2').append(`<div class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </div>`)
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
    xh.open("POST", "https://case-manger.herokuapp.com/adv/moredetails", true)
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
            document.getElementById('to').value=data.user.email
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
                        <h5>Venue: <span id="venue${data.user.date[i]._id}">${data.user.date[i].venue}</span></h5>
                        <h5>Details: <span id="det${data.user.date[i]._id}">${data.user.date[i].details}</span></h5>
                        <h5>Message For Client: <span id="msg${data.user.date[i]._id}">${data.user.date[i].msg}</span></h5>
                        <h5>Important Documents:</h5> 
                        <div class="form-group">
                          <label for="example-input-file">Upload Image/PDF</label>
                          <input type="file" name="avatar" id="avatar${data.user.date[i]._id}" accept="image/jpeg,image/png,application/pdf,image/jpg" class="form-control-file border"/>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" name="${data.user.case_no}%${data.user.date[i]._id}" onclick="addDoc(this.name)">Submit</button>
                    
                        <div class="accordion" id="docs${i+1}">
                        
                        </div>
                    </div>
                </div>`)
                console.log(data.user.date[i].files.length)
                for(var j=0;j<data.user.date[i].files.length;j++)
                {
                    $(`#docs${i+1}`).append(`<div class="card">
                    <div class="card-header" id="docs${i+1}-${j+1}" type="button" data-toggle="collapse" data-target="#docd${i+1}-${j+1}" aria-expanded="true" aria-controls="docs${i+1}-${j+1}">
                        <i class="fa fa-plus"></i> Document ${j+1}                      
                    </div>
                    <div id="docd${i+1}-${j+1}" class="card-body collapse" aria-labelledby="docs${i+1}-${j+1}" data-parent="#docs${i+1}">
                    <a href="https://case-manger.herokuapp.com/adv/get/upload?cno=${data.user.case_no}&dno=${data.user.date[i]._id}&updno=${data.user.date[i].files[j]._id}" download target="_blank">
                    View and download document</a>
                    </div>
                </div>`)
                }
                }
            }
            else{
                $('#dates').append(`<div class="card">
                    <div class="card-header" id="date1" type="button" data-toggle="collapse" data-target="#data1" aria-expanded="true" aria-controls="data1">
                        <i class="fa fa-plus"></i> No date history found                      
                    </div>`)
            }
        }
        else if(this.status==403)
        {
            localStorage.removeItem('user')
            localStorage.removeItem('JWT_Token')
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
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
    var getdate=document.getElementById('adate').value
    var hash=getdate.indexOf("-")
    var day=getdate.slice(0,hash)
    var l1=getdate.slice(hash+1,getdate.length)
    var h2=l1.indexOf("-")
    var month=l1.slice(0,h2)
    var year=l1.slice(h2+1,getdate.length)
    var revdate=year+"-"+month+"-"+day
    console.log(revdate)
    var data={
        "case_no":document.getElementById('cno').innerHTML,
        "name":document.getElementById('name').innerHTML,
        "date_details":{
            "date":document.getElementById('adate').value,
            "time":document.getElementById('atime').value,
            "details":document.getElementById('adetails').value,
            "msg":document.getElementById('amsg').value,
            "venue":document.getElementById('avenue').value,
            "revdate":revdate
        }    
    }
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/adv/add-date", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.status)
        if(this.status==201)
        {
            // var data = JSON.parse(this.responseText)
            // console.log(data)
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
    xh.open("POST", `https://case-manger.herokuapp.com/adv/update/case/details?case_no=${cno}`, true)
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
    document.getElementById('uvenue').value=document.getElementById('venue'+date_id).innerHTML
    document.getElementById('did').innerHTML=date_id
}
function editDate()
{

    var data={
        "date":document.getElementById('ucd').value,
        "details":document.getElementById('udet').value,
        "time":document.getElementById('utime').value,
        "venue":document.getElementById('uvenue').value,
        "msg":document.getElementById('umsg').value
    }
    var cno=document.getElementById('cno').innerHTML
    var date_id=document.getElementById('did').innerHTML
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", `https://case-manger.herokuapp.com/adv/update/case/date?case_no=${cno}&date_id=${date_id}`, true)
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
        "email":document.getElementById('mail').value,
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
    xh.open("POST", "https://case-manger.herokuapp.com/adv/add-case", true)
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
        else if(this.status==403)
        {
            localStorage.removeItem('user')
            localStorage.removeItem('JWT_Token')
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
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
    xh.open("GET", "https://case-manger.herokuapp.com/adv/count", true)
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
        else if(this.status==403)
        {
            localStorage.removeItem('user')
            localStorage.removeItem('JWT_Token')
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
        }
        else{
            document.getElementById('getcase').innerHTML="Unable to display"
        }
    }
}

function addDoc(cno)
{           
            console.log(cno)
            var hash=cno.indexOf("%")
            var case_no=cno.slice(0,hash)
            var dno=cno.slice(hash+1,cno.length)
            console.log(case_no)
            console.log(dno)
            var fileInput = document.getElementById('avatar'+dno);
			var data = new FormData();
			data.append("inputFile", fileInput.files[0],fileInput.files[0].name);
            console.log(fileInput.files[0].name)
			var xhr = new XMLHttpRequest();
			xhr.open(
				"POST",`https://case-manger.herokuapp.com/adv/upload?case_no=${case_no}&date_no=${dno}`
			);

            xhr.send(data)
            xhr.onload=function()
            {
                if(this.status==200)
                {
                    alert('file added')
                    window.location.reload()
                }
                else{
                    alert('failed')
                    window.location.reload()
                }
            }
}

function sendmail()
{
    var data={
        "to":document.getElementById('to').value,
        "subject":document.getElementById('subject').value,
        "message":document.getElementById('emailmsg').value
   
    }
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/send/email", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function()
    {
        if(this.status==200)
        {
            alert('Email sent successfully')
            window.location.reload()
        }
        else{
            alert('Failed to send email! Please try again')
        }
    }
}

function reminder(id)
{
    var cname=document.getElementById(`cn${id}`).innerHTML
    var cdate=document.getElementById(`d${id}`).innerHTML
    var judge=document.getElementById(`j${id}`).innerHTML
    var time=document.getElementById(`t${id}`).innerHTML
    var court=document.getElementById(`c${id}`).innerHTML
    var data={
        "to":document.getElementById(`e${id}`).innerHTML,
        "subject":"Reminder for upcoming case date",
        "message":`<h2>This is a reminder for your next date with respect to the below mentioned case details:</h2>
        <h4>Case Name : ${cname}</h4>
        <h4>Next Date : ${cdate}</h4>
        <h4>Time : ${time}</h4>
        <h4>Venue : ${court}</h4>
        <h4>Judge Name : ${judge}</h4>`
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/send/email", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function()
    {
        if(this.status==200)
        {
            alert('Reminder sent successfully')
        }
        else{
            alert('Failed to send email! Please try again')
        }
    }
}

function homecheck()
{
    var jwt=localStorage.getItem('JWT_Token')
    if(!jwt)
    {
        $('#homepg').append(`<div class="col"><a href="signup.html">Create Password</a></div>
        <div class="col"><a href="login.html">Login</a></div>`)

    }
    else{
        $('#homepg').append(`<div class="col"><a href="dashboard.html">My Dashboard</a></div>
        <div class="col">
        <a style="cursor: pointer; color: white;" onclick="logout()">Logout</a>
</div>`)

    }
}

function logout()
{
    localStorage.removeItem('user')
    localStorage.removeItem('JWT_Token')
    window.location.replace('index.html')
}

function check()
{
    var jwt=localStorage.getItem('JWT_Token')
    if(!jwt)
    {
        
        window.location.replace('login.html')

    }
}

function validate3()
{
    if(document.getElementById('pass').value && document.getElementById('email').value)
    {
        forgot()
    }
    else
    {
        alert('Please fill complete details!')
    }
}

function forgot()
{
    var data=
    {
	"email":document.getElementById('email').value,
	"password":document.getElementById('pass').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/admin/forgotpassword", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==201)
        {
            alert('Password updated!')
            window.location.replace('login.html')
        }
        else if(this.status==401){
            alert('Email is not registered! Make sure you enter the correct email.')
        }
        else
        {
            alert('Couldnot update password. Try again!')
            window.location.reload()
        }
}
}