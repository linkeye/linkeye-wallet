### Api document

#### Number one: Create account name 

* interface request name 

        account-name

* interface reponse name 

        account-name-back

* params 

        accountName
        
accountName: This param is username, people who can input throught web page and then pass through the interface to the background

* success response

        uuid

* fail response error code
 
        100 stand for input account name is null


#### Number two: Create account 

* interface request name 

        generate-keystore

* interface reponse name 

        back-privateKey

* params 

        passwd

* success response

        privateKey

privateKey is json object which include account address, account private, account keystore and account ciphertextprivate key 

* fail response error code
 
        101 present for password from frontend is null
        102 present for generate keystore fail


#### Number three: Generate account and insert account data into account table of sqlite three database

* interface request name 

        generate-account

* interface reponse name 

        generate-account-back

* params 

        accountJson
        
accountJson is a json object that contain account ID, account name account password account address, account keystore and account ciphertext private key 

* success response

        success
The key of success is generateMsg, you can get the value of generateMsg so that you can veryfy response success 

* fail response error code
 
        103 present for accountJson from frontend is null
        104 present for get database handle fail and the database handle is null
        105 present for create account table fail


#### Number four:Get account balance from our linkeye wallet node

* interface request name 

        balance

* interface reponse name 

        balance-back

* params 

        accountAddress
        
accountAddress is account address which include in keystore, in our project we save it in sqlite3 database

* success response

        success
The key of success is generateMsg, you can get the value of generateMsg so that you can veryfy response success 

* fail response error code
 
        103 present for accountJson from frontend is null
        104 present for get database handle fail and the database handle is null
        105 present for create account table fail
