//Parameters: elementType = HTMl element string name to be created (eg. button, p)
//text = text of the element to be created
//className(optional) name of class to be applied
//Returns created element
function createElemWithText(elementType = "p", text = "", className)
{
    //Create new element
    const newElement = document.createElement(elementType);
    newElement.textContent = text;
    //If className is specified, add newElement to the class
    if(className) newElement.classList.add(className);
    return newElement;
}

//Creates an option element for each user
//Parameters: jsonData = users json data
//Returns: an array of options elements if parameter is received; 
//returns undefined if no user data is received.
function createSelectOptions(users)
{
    //If no parameter is accepted, return undefined
    if (!users) return;
    const usersArray = [];
     //Create option element for each user
     for(let i=0; i < users.length; i++)
    {
        let user = users[i];
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        usersArray.push(option);
    }
    return usersArray;
}

function toggleCommentSection(postID)
{
    if (!postID) return;
    const post = document.querySelector(`section[data-post-id = '${postID}']`);
    //if parameter does not match a post ID, return null
    if (!post) return null;
    //toggle hide class on section element
    post.classList.toggle("hide");

    return post;
}

function toggleCommentButton(postID)
{
    if (!postID) return;


    const button = document.querySelector(`button[data-post-id = '${postID}']`);
    //if parameter does not match a post ID, return null
    if (!button) return null;
    if (button.textContent === "Show Comments")
    {
        button.textContent = "Hide Comments";
    }
    else
    {
        button.textContent = "Show Comments";
    }
    return button;
}

function deleteChildElements(parentElement)
{
    if (!(parentElement instanceof Element)) return;
    let child = parentElement.lastElementChild;
    while (child)
    {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners()
{
    //selects all buttons in the Main element
    const buttons = document.querySelectorAll('main button');
        for(let i=0; i < buttons.length; i++)
        {
            let button = buttons[i];
            const postnum = button.dataset.postId;
            button.addEventListener('click', (e) => {toggleComments(e, postnum)}, false);
        } 

    return buttons;
}

function removeButtonListeners()
{
    const buttons = document.querySelectorAll("main button");
    if (buttons?.tageName)
    {
        for(let i=0; i < buttons.length; i++)
        {
            let button = buttons[i];
            const postID = button.dataset.id;
            button.removeEventListener("click", toggleComments, false);
        }
    }
    return buttons;
}

function createComments(comments)
{
    if (!comments) return;
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < comments.length; i++)
    {
        let comment = comments[i];
        let article = document.createElement("article");
        const h3 = createElemWithText('h3', comment.name);
        const para1 = createElemWithText('p', comment.body);
        const para2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, para1, para2);
        fragment.append(article);
    }
    return fragment;
}

function populateSelectMenu(jsonData)
{
    if (!jsonData) return;
    let selectMenu = document.getElementById("selectMenu");
    const optionsArray = createSelectOptions(jsonData);
    for (option in optionsArray)
    {
        selectMenu.append(option);
    }
    return selectMenu;
}

async function getUsers()
{
    try{
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("No response from API");

        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

async function getUserPosts(userID)
{
    if (!userID) return;
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}/posts`);
        if (!response.ok) throw new Error("No response from API");

        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

async function getUser(userID)
{
    if (!userID) return;
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}`);
        if (!response.ok) throw new Error("No response from API");

        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

async function getPostComments(postID)
{
    if (!postID) return;
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postID}/comments`);
        if (!response.ok) throw new Error("No response from API");

        return await response.json();
    }
    catch(error){
        console.error(error);
    }
}

async function displayComments(postId)
{
    if (!postId) return;
    let section = document.createElement("section");
    section.dataset.postId = postId;

    section.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    section.append(fragment);
    return section;
}

async function createPosts(posts)
{
    if (!posts) return;
    let fragment = document.createDocumentFragment();

    for(let i=0; i < posts.length; i++)
    {
        let post = posts[i];
        let article = document.createElement("article");
        let h2 = createElemWithText('h2', post.title);
        let para1 = createElemWithText('p', post.body);
        let para2 = createElemWithText('p', `Post ID: ${post.id}`);
        let author = await getUser(post.userId);
        
        let para3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        let para4 = createElemWithText('p', author.company.catchPhrase);
        let button = createElemWithText('button', "Show Comments");
        button.dataset.postId = post.id;
        
        article.append(h2, para1, para2, para3, para4, button);
        let section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
}

async function displayPosts(posts)
{
    let main = document.querySelector('main');
    let element = (posts) ? await createPosts(posts) : document.querySelector('main p.default-text');
    main.append(element);
    return element;
}

function toggleComments (event, postID)
{
    if (!event || !postID) return;
    event.target.listener = true;

    const elementArray = [];
    let section = toggleCommentSection(postID);
    let button = toggleCommentButton(postID);
    elementArray.push(section, button);
    return elementArray;
}

async function refreshPosts(posts)
{
    if (!posts) return;

    const resultArray = [];
    let removeButtons = removeButtonListeners(); 
    let mainElement = document.querySelector('main');
    let main = deleteChildElements(mainElement);
    let fragment = await displayPosts(posts);
    let addButtons = addButtonListeners();

    resultArray.push(removeButtons, main, fragment, addButtons);
    return resultArray;
}   

async function selectMenuChangeEventHandler(event)
{
    const allArray = [];
    const userId = event?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    allArray.push(userId, posts, refreshPostsArray);
    return allArray;
}
async function initPage()
{
    const dataArray = [];
    let users = await getUsers();
    let select = populateSelectMenu(users);
    dataArray.push(users, select);

    return dataArray;
}

function initApp()
{
    initPage();
    let selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler, false);
}



//Event listener listens for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', initApp);


