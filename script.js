var uid = new ShortUniqueId();
// console.log(uid());
let colors=["pink","blue","green","black"];
let defaultColor="black";
let cFilter="";
let main=document.querySelector(".main-container");
let deleteMode=false;
let modal=document.querySelector(".modal");
let colorChooser=document.querySelector(".color-container");
let allColorElements=document.querySelectorAll(".color-picker");

let input=document.querySelector(".input-text-container");
input.addEventListener("keydown",function(edesc){
    let keyPressed=edesc.key;
    if(keyPressed=='Enter'&& input.value){
        let id=uid();
        modal.style.display="none";
        let task=input.value;
        createTask(id,task,true);
        input.value="";
    }

});

colorChooser.addEventListener("click",function(e){
    let element=e.target;
    if(element!=colorChooser){
        let filteredCardColor=element.classList[1];
        defaultColor=filteredCardColor;
        //border change
        for(let i=0;i<allColorElements.length;i++){
            //remove from all
            allColorElements[i].classList.remove("selected");

        }
        //add
        element.classList.add("selected");
        
    }
});

function createTask(id,task,flag,color){
    let taskContainer=document.createElement("div");
    taskContainer.setAttribute("class","task_container");
    main.appendChild(taskContainer);

    taskContainer.innerHTML=`
    <div class="task_header ${color?color:defaultColor}"></div>
    <div class="task_main-container">
        <h3 class="task_id">#${id}</h3>
        <div class="text" contentEditable="true">${task}</div>
    </div>`;
// addEventListener for color changes
let taskHeader = taskContainer.querySelector(".task_header");
let inputTask = taskContainer.querySelector(".task_main-container>div");
// functionality -> color change ,delete 
// local storage 
// color
taskHeader.addEventListener("click",function(){
    //class -> change
    //get all the classes on an element
    let cColor=taskHeader.classList[1];
    let idx=colors.indexOf(cColor);
    let nextIdx=(idx+1)%4;
    let nextColor=colors[nextIdx];
    taskHeader.classList.remove(cColor);
    taskHeader.classList.add(nextColor);

    //update color in local storage
    let idWalaElement=taskHeader.parentNode.children[1].children[0];
    let id=idWalaElement.textContent;
    id=id.split("#")[1];

    let tasksString=localStorage.getItem("tasks");
    let tasksArr=JSON.parse(tasksString);
    
    for(let i=0;i<tasksArr.length;i++){
        if(tasksArr[i].id==id){
            tasksArr[i].color=nextColor;
            break;
        }
    }
    localStorage.setItem("tasks",JSON.stringify(tasksArr));
});
inputTask.addEventListener("blur", function (e) {
    let content = inputTask.textContent;
    let tasksString = localStorage.getItem("tasks");
    let tasksArr = JSON.parse(tasksString)
    // {id: "nDCn8Q", task: "ffdsjbdshf", color: "pink} , {}
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id == id) {
            tasksArr[i].task = content;
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
});
//delete container
taskContainer.addEventListener("click",function(){
    
    if(deleteMode){
        //remove from local Storage
        let tasksString=localStorage.getItem("tasks");
        let tasksArr=JSON.parse(tasksString);
        for(let i=0;i<tasksArr.length;i++){
        if(tasksArr[i].id==id){
                tasksArr.splice(i,1);
                localStorage.setItem("tasks",JSON.stringify(tasksArr));
                taskContainer.remove();
                break;
            }
        }
    }
});

//set local storage
if(flag==true){
    let tasksString=localStorage.getItem("tasks");
    let tasksArr=JSON.parse(tasksString)||[];
    let tasksObject = {
        id: id,
        task: task,
        color: defaultColor

    }
    tasksArr.push(tasksObject);
    localStorage.setItem("tasks",JSON.stringify(tasksArr));

}
defaultColor="black";
    //  unhide modal
    // appear on plus click
}

//plus function
let plusContainer=document.querySelector(".plus-container");
plusContainer.addEventListener("click",function(){
    modal.style.display="flex";

});

//filter out the containers on the basis of colors
let colorContainer=document.querySelector(".color-group_container");
colorContainer.addEventListener("click",function(e){
    let element=e.target;
    if(e.target!=colorContainer){
        let filteredCardColor=element.classList[1];
        filteredCards(filteredCardColor);
        
    }
});

function filteredCards(filterColor){
    let allTaskCards=document.querySelectorAll(".task_container");
    if(cFilter!=filterColor){
        for(let i=0;i<allTaskCards.length;i++){
            //header color ->
            let taskHeader=allTaskCards[i].querySelector(".task_header");
            let taskColor=taskHeader.classList[1];
    
            if(taskColor==filterColor){
                //show
                allTaskCards[i].style.display="block";
    
            }else{
                //hide
                allTaskCards[i].style.display="none";
    
            }
    
        }
        cFilter=filterColor; 
    }
    else{
        cFilter="";
        for(let i=0;i<allTaskCards.length;i++){
            
                allTaskCards[i].style.display="block";
    
            }

    }

}

//delete container
let multiplyContainer=document.querySelector(".multiply-container");
multiplyContainer.addEventListener("click",function(){
    deleteMode=!deleteMode;
    if(deleteMode){
        multiplyContainer.classList.add("active");
    }else{
        multiplyContainer.classList.remove("active");
    }
    
});

//lock-unlock
let lockContainer=document.querySelector(".lock-container");
let unlockContainer=document.querySelector(".unlock-container");

//lock
lockContainer.addEventListener("click",function(){
    let numberOfElements=document.querySelectorAll(".task_main-container>div");
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable=false;
    }
    //ui match
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active");
});

//unlock
unlockContainer.addEventListener("click",function(){
    let numberOfElements=document.querySelectorAll(".task_main-container>div");
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable=true;
    }
    //ui match
    unlockContainer.classList.add("active");
    lockContainer.classList.remove("active");
});


//local Storage
(function(){
    modal.style.display="none";
    let tasks=JSON.parse(localStorage.getItem("tasks"));
    for(let i=0;i<tasks.length;i++){
        let {id,task,color}=tasks[i];
        createTask(id,task,false,color);
    }
    

})();