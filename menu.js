// 顯示或隱藏子選單
var VisibleMenu = ''; // 記錄目前顯示的子選單的 ID
var VisibleMenu2 = ''; // 記錄目前顯示的子選單的 ID
function switchMenu( theMainMenu, theSubMenu, theEvent ){
    var SubMenu = document.getElementById( theSubMenu );
    if( SubMenu.style.display == 'none' ){ // 顯示子選單
        SubMenu.style.minWidth = theMainMenu.clientWidth; // 讓子選單的最小寬度與主選單相同 (僅為了美觀)
        SubMenu.style.display = 'block';
        hideMenu(); // 隱藏子選單
        VisibleMenu = theSubMenu;
    }
    else{ // 隱藏子選單
        if( theEvent != 'MouseOver' || VisibleMenu != theSubMenu ){
            SubMenu.style.display = 'none';
            VisibleMenu = '';
        }
    }
}
function switchSubMenu( theMainMenu, theSubMenu, theEvent ){
    var SubMenu = document.getElementById( theSubMenu );
    if( SubMenu.style.display == 'none' ){ // 顯示子選單
        // SubMenu.style.minWidth = theMainMenu.clientWidth; // 讓子選單的最小寬度與主選單相同 (僅為了美觀)
        SubMenu.style.marginLeft = '0px';
        SubMenu.style.display = 'inline-block';
        hideSubMenu(); // 隱藏子選單
        VisibleMenu2 = theSubMenu;
    }
    else{ // 隱藏子選單
        if( theEvent != 'MouseOver' || VisibleMenu2 != theSubMenu ){
            SubMenu.style.display = 'none';
            VisibleMenu2 = '';
        }
    }
}

// 隱藏子選單
function hideMenu(){
    if( VisibleMenu != '' ){
        document.getElementById( VisibleMenu ).style.display = 'none';
    }
    VisibleMenu = '';
}
function hideSubMenu(){
    if( VisibleMenu2 != '' ){
        document.getElementById( VisibleMenu2 ).style.display = 'none';
    }
    VisibleMenu2 = '';
}