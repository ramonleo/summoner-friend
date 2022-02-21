module.exports = {
  FriendListHtmlElements: function(friendList) {    
    let friendListHtmlElements = [];
    friendList.forEach(summoner => {

      var divFriendBox = document.createElement('div');
      divFriendBox.className = 'nearby-user';

      var divRow = document.createElement('div');
      divRow.className = 'row';
      
      // Summoner Pic
      var divFriendIcon = document.createElement('div');
      divFriendIcon.className = 'col-md-2 col-sm-2';
      
      var imgFriendIcon = document.createElement('img');
      imgFriendIcon.src = 'https://bootdey.com/img/Content/avatar/avatar7.png';
      imgFriendIcon.className = 'profile-photo-lg';
      imgFriendIcon.alt = 'user-icon';

      // Summoner Name and info
      var divFriendInfo = document.createElement('div');
      divFriendInfo.className = 'col-md-7 col-sm-7';

      var h5FriendName = document.createElement('h5');
      h5FriendName.className = 'friend-name';

      var aFriendName = document.createElement('a');
      aFriendName.href = '#';
      aFriendName.className = 'profile-link';
      aFriendName.innerHTML = summoner["friendData"]["gameName"];


      var pFriendInfo = document.createElement('p');
      pFriendInfo.className = 'friend-info';
      pFriendInfo.innerHTML = Object.keys(summoner["previousNames"]).join(", ");

      var pFriendAltInfo = document.createElement('p');
      pFriendAltInfo.className = 'text-muted';
      pFriendAltInfo.innerHTML = "Extra info here";

      // Summoner Actions
      var divFriendAction = document.createElement('div');
      divFriendAction.className = 'col-md-3 col-sm-3';

      var buttonFriendAction = document.createElement('button');
      buttonFriendAction.className = 'btn btn-primary pull-right';
      buttonFriendAction.innerHTML = 'Add Friend';


      divFriendBox.appendChild(divRow);

      divRow.appendChild(divFriendIcon);
      divRow.appendChild(divFriendInfo);
      divRow.appendChild(divFriendAction);

      divFriendIcon.appendChild(imgFriendIcon);

      divFriendInfo.appendChild(h5FriendName);
      h5FriendName.appendChild(aFriendName);
      divFriendInfo.appendChild(pFriendInfo);
      divFriendInfo.appendChild(pFriendAltInfo);

      divFriendAction.appendChild(buttonFriendAction);

      friendListHtmlElements.push(divFriendBox);
    });
    return friendListHtmlElements;
  }
}  