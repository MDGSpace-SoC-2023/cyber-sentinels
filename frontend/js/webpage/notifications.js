var collapsibles = document.getElementsByClassName("Arrow");
collapsibles[0].addEventListener("click", function () {
    var menu = document.getElementsByClassName("Menu")[0];
    menu.classList.toggle("hidden");
    var mainSection = document.getElementsByClassName("Main")[0];
    mainSection.classList.toggle("full-width", menu.classList.contains("hidden"));
    var Heading = document.getElementsByClassName("heading")[0];
    var arrow = document.getElementsByClassName("Arrow")[0];
    if (menu.classList.contains('hidden')) {
        arrow.innerHTML = "&#707;";
        Heading.style.left = "2%";
    } else {
        arrow.innerHTML = "&#706;";
        Heading.style.left = "22%";
    }
});
var startDate=document.getElementById("startDate");
var endDate=document.getElementById("endDate");
startDate.addEventListener('change',function(){
    var dates=document.querySelectorAll('.dttm p');
    for(var i=0;i<dates.length;i++){
        if(new Date(startDate.value)>new Date(dates[i].innerHTML.trim())){
            if(!dates[i].parentElement.parentElement.classList.contains("notvisible")){
                dates[i].parentElement.parentElement.classList.toggle("notvisible");
            }
        }else{
            if(dates[i].parentElement.parentElement.classList.contains("notvisible")){
                dates[i].parentElement.parentElement.classList.toggle("notvisible");
            }
        }
    }
});
endDate.addEventListener('change',function(){
    var dates=document.querySelectorAll('.dttm p');
    for(var i=0;i<dates.length;i++){
        if(new Date(endDate.value)<new Date(dates[i].innerHTML.trim())){
            if(!dates[i].parentElement.parentElement.classList.contains("notvisible")){
                dates[i].parentElement.parentElement.classList.toggle("notvisible");
            }
        }else{
            if(dates[i].parentElement.parentElement.classList.contains("notvisible")){
                dates[i].parentElement.parentElement.classList.toggle("notvisible");
            }
        }
    }
});
function Filterntfctns(c){
    if(c==='All'){
        c="ntfcation";
    }
    var notifications=document.getElementsByClassName("ntfcation");
    for(var i=0;i<notifications.length;i++){
        if(!notifications[i].classList.contains(c)){
            if(!notifications[i].classList.contains("notshow")){
                notifications[i].classList.toggle("notshow");
            }
        }else{
            if(notifications[i].classList.contains("notshow")){
                notifications[i].classList.toggle("notshow");
            }
        }
    }
}
function FilterSevere(c){
    var notifications=document.getElementsByClassName("ntfcation");
    if(c==="All"){
        for(var i=0;i<notifications.length;i++){
            if(notifications[i].classList.contains("notavailable")){
                notifications[i].classList.toggle("notavailable");
            }
        }  
    }else if(c==="Sev"){
        var Severentfications=document.getElementsByClassName("severity");
        for(var i=0;i<notifications.length;i++){
            if(!notifications[i].classList.contains("notavailable")){
                notifications[i].classList.toggle("notavailable");
            }
        }  
        for(var i=0;i<Severentfications.length;i++){
            if(Severentfications[i].parentElement.parentElement.classList.contains("notavailable")){
                Severentfications[i].parentElement.parentElement.classList.toggle("notavailable");
            }
        }
    }else{
        for(var i=0;i<notifications.length;i++){
            if(notifications[i].classList.contains("notavailable")){
                notifications[i].classList.toggle("notavailable");
            }
        } 
        var Severentfications=document.getElementsByClassName("severity");
        for(var i=0;i<Severentfications.length;i++){
            if(!Severentfications[i].parentElement.parentElement.classList.contains("notavailable")){
                Severentfications[i].parentElement.parentElement.classList.toggle("notavailable");
            }
        }
    }
}
var account=document.getElementById("Account");
account.addEventListener("click",function(){
    var accountOptions=document.getElementsByClassName("accnt");
    for(var i=0;i<accountOptions.length;i++){
        var cmptdStyle = window.getComputedStyle(accountOptions[i]);
        if(cmptdStyle.display === "none" || cmptdStyle.getPropertyValue('display') === 'none'){
            accountOptions[i].style.display="block";
        }else{
            accountOptions[i].style.display="none";
        }
    }
});