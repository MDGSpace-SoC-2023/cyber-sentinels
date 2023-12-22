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
function search_Domain() {
    var domains=document.getElementsByClassName("Domains");
    var darkwbntfctns=document.getElementsByClassName("drkwebntfcation");
    var input = document.getElementById("searchbar").value.toLowerCase();
    for(var i=0;i<darkwbntfctns.length;i++){
        if(domains[i].innerHTML.toLowerCase().includes(input.toLowerCase())){
            if(darkwbntfctns[i].classList.contains("hide")){
                darkwbntfctns[i].classList.toggle("hide");
            }
        }else{
            if(!darkwbntfctns[i].classList.contains("hide")){
                darkwbntfctns[i].classList.toggle("hide");
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