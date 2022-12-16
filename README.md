# **T11 - Web Application**

## **Descripton**

Web Application is one of the components of the Dentistimo system. Dentistimo allows users to view and book dentist appointments in the city of Gothenburg. More information can be found [here](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-project).

Web Application represents Graphical User Interface (GUI) for the user to interact with in order to book dental appointments. Web Application communicates to other components in order to achieve following goals:
- [Database Model Handler](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-database-model-handler) to get information needed to display pins of clinics saved in database on the map of Gothenburg along with their names and opening hours,
- [Schedule Handler](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-schedule-handler) to display dental appointment slots according to the user's date choice and update schedule dynamically, and
- [Booking Validator](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-booking-validator) to proceed with the user's booking request, and display notification to the user depending on the booking outcome (success, warning, failure or service unavailable) according to the message recieved from Booking Validator.

## **Responsability**

### **<ins>Map subcomponent</ins>**
- Display map of Gothenburg
- Display pins for dental clinics according to their coordinates
- Display dental clinic name and opening hours upon clicking on pin

### **<ins>Search bar subcomponent</ins>**
- Display date picker for user to be able to select the date for dental appointment
- Display 'search' button that triggers the update of <ins>Schedule subcomponent</ins>

### **<ins>Schedule subcomponent</ins>**
- Display appointment slots for the week according to date that user selected <br/>
<ins>Color coding for the slots according to availability:</ins><br/>
        - *grey* - 0 slots available<br/>
        - *yellow* - only 1 slot available<br/>
        - *green* - 2 or more slots available.
- Appointment slots are clickable (for slots with availability of 1 or more) and trigger <ins>Selection of clinic</ins> popup

### **<ins>Dynamic subcomponents</ins>**
- <ins>*Selection of clinic popup*:</ins> provides the user with available clinics options to be selected from
- <ins>*User input popup*:</ins> prompts the user to provide name and email address to complete the booking
- <ins>*Success popup*:</ins> notifies the user that booking was successful (displays data provided during booking process) and confirmation email has been sent
- <ins>*Warning popup*:</ins> notifies the user that the booking was successful (displays data provided during booking process) and an error occurred upon sending confirmation email
- <ins>*Error popup*:</ins> notifies the user that an error occurred during booking process and prompts to try using services again later
- <ins>*Service unavailable popup*:</ins> notifies the user that service is currently unavailable and prevents the user from sending request to already overloaded system

## **Data flow**

### **<ins>Input Data</ins>**
The **input data** of this component is the dental clinics data received from [Database Model Handler](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-database-model-handler) and booking response data received from [Booking Validator](https://git.chalmers.se/courses/dit355/dit356-2022/t-11/t11-booking-validator).

>Example of Dental clinics data
```
{
    "id": 1,
    "name": "Your Dentist",
    "dentists": 3,
    "coordinate": {
        "longitude": 11.969388,
        "latitude": 57.707619
    },
    "openinghours": {
        "monday": "9:00-17:00",
        "tuesday": "8:00-17:00",
        "wednesday": "7:00-16:00",
        "thursday": "9:00-17:00",
        "friday": "9:00-15:00"
    }
}
```
>Example of Booking response
```
{
  "userid": "example@mail.com",
  "requestid": 13,
  "dentistId": 2,
  "date": "2020-12-14",
  "time": "9:30-10:00",
  "name": "John",
  "sessionid": "5355QPITzxL9-tGW1yOUMITYwIYk4Vdz"
}
```

### **<ins>Output Data</ins>**
The **output data** of this components is the information sent once the user provided necessary information and confirmed the booking.
>Example of Booking request
```
{
  "userid": "example@gmail.com",
  "requestid": 13,
  "dentistid": 2,
  "issuance": 1602406766314,
  "date": "2020-12-14",
  "time": "13.00-13.30",
  "name": "John",
  "sessionid": "5355QPITzxL9-tGW1yOUMITYwIYk4Vdz"
}
```

## **Tools**

> NPM <br>[ Download here ](https://www.npmjs.com/)

> Vue.js <br>[ Download here ](https://vuejs.org/)

> Vite <br >[ Download here ](https://vitejs.dev/)

> Bootstrap <br> [ Download here ](https://getbootstrap.com/)

> BootstrapVue <br> [ Download here ](https://bootstrap-vue.org/)

> VueGeolocation API <br> [ More information here ](https://developers.google.com/maps/documentation/javascript/cloud-setup)

> VueGoogleMaps <br> [ More information here ](https://developers.google.com/maps/documentation/javascript/cloud-setup)

> JavaScript IDE<br> Some alternatives: [Visual Studio Code](https://visualstudio.microsoft.com/downloads/) , [WebStorm](https://www.jetbrains.com/webstorm/download/)

### **<ins>Setup</ins>**

| Description | Command |
|-------|---|
| Clone this repository | <ins>Option 1</ins><br> Download as a `zip` file<br> <ins>Option 2</ins><br>`git clone git@git.chalmers.se:courses/dit355/dit356-2022/t-11/t11-web-application.git`|
| Open terminal and navigate to mosquitto root folder |  `mosquitto -c mosquitto.conf -v ` |
|Open the repo in JavaScript IDE and open the terminal in the IDE. Navigate to the **backend** folder | `npm install` |
|After installation is completed, navigate back to the **root** folder and then to the **frontend** folder | `npm install` |











