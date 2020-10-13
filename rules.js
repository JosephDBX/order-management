rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
  
  	function isLogIn() {
    	return request.auth != null;
    }
  
  	function currentUser() {
    	return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
  
  	function isDeliveryWorker() {
    	return currentUser().roles.isDeliveryWorker == true;
    }
    
    function isDoctor() {
    	return currentUser().roles.isDoctor == true;
    }
    
    function isReceptionist() {
    	return currentUser().roles.isReceptionist == true;
    }
    
    function isLaboratorist() {
    	return currentUser().roles.isLaboratorist == true;
    }
    
    function isAdmin() {
    	return currentUser().roles.isAdmin == true;
    }
    
    function getOrder(orderId) {
    	return get(/databases/$(database)/documents/orders/$(orderId)).data;
    }
    
    function isUserPatient(userId, patientId) {
    	let id = userId + "_" + patientId;
    	return exists(/databases/$(database)/documents/user_patients/$(id));
    }
    
//    match /{document=**} {
//      allow read, write: if request.time < timestamp.date(2020, 10, 20);
//    }
    
    match /areas/{areaId} {
      allow read: if true;
      allow write: if isLogIn() && isAdmin();
    }
    
    match /fcmTokens/{tokenId} {
    	allow read: if false;
      allow write: if isLogIn() && isReceptionist();
    }
    
    match /order_profiles/{opId} {
    	allow read: if isLogIn();// && (isUserPatient(request.auth.uid, getOrder(resource.data.order).patient) || isReceptionist() || isLaboratorist() || isDeliveryWorker());
      allow create: if isLogIn() && (isUserPatient(request.auth.uid, getOrder(request.resource.data.order).patient) || isReceptionist());
      allow update, delete: if isLogIn() && (isUserPatient(request.auth.uid, getOrder(resource.data.order).patient) || isReceptionist());
    }
    
    match /order_tests/{otId} {
    	allow read: if isLogIn();// && (isUserPatient(request.auth.uid, getOrder(resource.data.order).patient) || isReceptionist() || isLaboratorist() || isDeliveryWorker());
      allow create: if isLogIn() && (isUserPatient(request.auth.uid, getOrder(request.resource.data.order).patient) || isReceptionist());
      allow update, delete: if isLogIn() && (isUserPatient(request.auth.uid, getOrder(resource.data.order).patient) || isReceptionist());
    }
    
    match /orders/{orderId} {
    	allow read: if isLogIn() && (isUserPatient(request.auth.uid, resource.data.patient) || isReceptionist() || isLaboratorist() || isDeliveryWorker());
      allow create: if isLogIn() && (isUserPatient(request.auth.uid, request.resource.data.patient) || isReceptionist());
      allow update: if isLogIn() &&
      ((isUserPatient(request.auth.uid, resource.data.patient) && resource.data.state == "pending")
      || (isReceptionist() && resource.data.state != "complete")
      || (isDeliveryWorker()  && resource.data.state == "pending" && request.resource.data.state == "process")
      || (isLaboratorist() && resource.data.state == "process" && request.resource.data.state == "complete"));
      allow delete: if isLogIn() && resource.data.state == "pending"
      && (isUserPatient(request.auth.uid, resource.data.patient) || isReceptionist());
    }
    
    match /patients/{patientId} {
    	allow read: if isLogIn();// && (isUserPatient(request.auth.uid, resource.id) || isReceptionist() || isLaboratorist() || isDeliveryWorker());
      allow create: if isLogIn();
      allow update: if isLogIn() && (isUserPatient(request.auth.uid, resource.id) || isReceptionist());
    }
    
    match /profile_tests/{ptId} {
    	allow read: if true;
      allow write: if isLogIn() && isAdmin();
    }
    
    match /profiles/{profileId} {
    	allow read: if true;
      allow write: if isLogIn() && isAdmin();
    }
    
    match /tests/{testId} {
    	allow read: if true;
      allow write: if isLogIn() && isAdmin();
    }
    
    match /user_patients/{upId} {
    	allow read: if isLogIn();// && (request.auth.uid == resource.data.user || isReceptionist());
      allow create: if isLogIn() && ((request.auth.uid == request.resource.data.user && isDoctor()) || isReceptionist());
      allow delete: if isLogIn() && ((request.auth.uid == resource.data.user && isDoctor()) || isReceptionist());
    }
    
    match /users/{userId} {
    	allow read: if true;
      allow create: if true;
      allow update: if isLogIn() && (
      (request.auth.uid == resource.data.user && 
      request.resource.data.roles == null && 
      request.resource.data.email == null &&
      request.resource.data.uid == null) || (
      isReceptionist()&& 
      request.resource.data.roles == null && 
      request.resource.data.email == null &&
      request.resource.data.uid == null) || isAdmin());
    }
  }
}
