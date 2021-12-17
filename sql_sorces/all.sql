create database shopeeMaikrub;
use shopeeMaikrub;

create table  roomType (
       roomType_Id int(10) primary key,
       roomType_Name varchar(100),
       productType_Description varchar(300),
       productType_Price float(20),
       productType_Stock int(100)
);
create table tbUser(
	  User_Id int NOT NULL AUTO_INCREMENT primary key,
	  User_Username varchar(100),
	  User_Password varchar(100),
	  User_Fname varchar(100),
	  User_Lname varchar(100),
	  Address  varchar(100),
	  User_Age  int(3),
	  Email  varchar(100)
);
create table Administrators(
      Admin_Id int NOT NULL primary key,
	  Admin_Username varchar(100),
	  Admin_Password varchar(100),
	  Admin_Fname varchar(100),
	  Admin_Lname varchar(100),
	  Address  varchar(100),
	  User_Age  int(3),
	  Email  varchar(100)
);


