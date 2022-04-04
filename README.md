# Cymotive Challenge

## AWS exercise

You will build an Intrusion detection system (IDS) system to detect anomalies in vehicles using AWS Cloud. In this assignment you will develop ETL (Extract, transform, load) data pipelines to gather data from a vehicle and put them into a single location to query and extract insights.

You will use mock data reports located in the attached file called 'reports.json'.

In the first stage, you will focus on collecting and saving the reports into a Data Lake .
In the second stage, the system will have also the ability to save the reports into DynamoDb.
In the third stage, you will add the ability to read and analyze the already saved reports.

---

## Topics :

#### IAM | Api-Gateway | Lambda | S3 | DynamoDB | Cloud watch | SQS | CloudFormation | CDK

---

## Resources :

- **[AWS API Gateway with Lambda Function Tutorial (2018)](https://www.youtube.com/watch?v=RUXOLUCvJF0&list=PLaxxQQak6D_fPPkcKP1e75LvYEPipBNlw&index=1)**
- **[AWS Lambda + DynamoDB Example Tutorial (2018)](https://www.youtube.com/watch?v=usgK4KsdNWM&list=PLaxxQQak6D_fPPkcKP1e75LvYEPipBNlw&index=2)**
- **[AWS Lambda upload to s3 using Node JS (2020)](https://www.youtube.com/watch?v=Wnbw15Oue1k&t=177s)**

#### One more thing before you start, in case you are having difficulty - To see hints about every phase open the README in your vs code

---

## Phase 1:

- **Create REST api-gateway called `idsgateway`.**

- **Create NodeJS lambda called `porter`.**

- **Create POST method on `idsgateway` and integrate it with `porter` lambda.**

- **Deploy the api to a new Stage called `api`.**

- **Create an s3 bucket.**

- **Implement porter lambda to receive events from `idsgateway` and save the received report into the bucket.**

- **Iterate over the reports located in the attached `reports.json` file and send them to your api gateway.**
  **use some HTTP client of your choice. (axios is recommended).**

![Phase 1](./ReadMe.images/graph1.png)

<!--
Hints for Phase 1:
1 - Read about `AWS-SDK` !
2 - Granting appropriate permissions!
-->

---

## Phase 2:

- **Create another NodeJS lambda called `ingest`.**

- **Configure an s3 event notification to invoke the ingest lambda when a new object been inserted into the bucket.**

- **Create a DynamoDB table called `ids-table`. Primary key: `vehicleId`.**

- **Implement Ingest lambda to receive the object path from s3 on object insertion, then read the object and save it to DynamoDB.**

### Tip:

- **Watch out from recursion, it can cost you a lot of money! 😱💸**

![Phase 2](./ReadMe.images/graph2.png)

<!--
Hints for Phase 2:
1 - It is recommended to use `AWS.DynamoDB.DocumentClient` !
2 - Granting appropriate permissions!
-->

---

## Phase 3:

- **Create NodeJS lambda called `analyzer`.**

- **Create GET method on `idsgateway`, configure the integration point to invoke `analyzer` lambda.**

- **Implement `analyzer` lambda to support several GET paths.**

  - **`numberOfReports` – return the total number of reports stored in DynamoDb.**

  - **`numberOfVehicles` – return the number of vehicles record stored in DynamoDb.**

  - **`numberOfAnomalies` – return the number of signals that their ‘sum’ value is out of the acceptable range.**

![Phase 3](ReadMe.images/graph3.png)

<!--
Hints for Phase 3:
1 - For a change in the GATEWAY API to take effect, you need to remember to do a deploy.
2 - Pay attention to CORS - add to headers.
3 - When creating the various requests in the api gateway you need to create a RESOURCE and within it the methods-
   and note to mark proxy in the methods that are created.
4 - Read about : lambda-proxy-vs-lambda-integration -
    https://medium.com/@lakshmanLD/lambda-proxy-vs-lambda-integration-in-aws-api-gateway-3a9397af0e6d
-->

---

## Bonus I - Infrastructure as code (AWS CDK):

**So far using the console much of Amazon's "magic" has happened behind the scenes for us.**
**We will now use another Amazon service to configure everything ourselves by code. Including the roles, policies and functionality.**
**It's called - Infrastructure as code**

- **Read about [CloudFormation](https://aws.amazon.com/cloudformation/getting-started/) - Because the output of an AWS CDK program is an AWS CloudFormation template**
- **Use [CDK - AWS Cloud Development Kit](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) And now solve the task by using this framework.**

---

## Bonus II - (SQS):

**We just connected another 10 million cars and we're receiving billions of records a minute.**

- **Add a queue (using SQS) between the POST gateway and the porter lambda**
- **Use either the console or the AWS CDK**
- If you are having trouble:
  - [API Proxy for SQS](https://medium.com/@pranaysankpal/aws-api-gateway-proxy-for-sqs-simple-queue-service-5b08fe18ce50)
  - [AWS CDK: Amazon API Gateway integration for SQS](https://sbstjn.com/blog/aws-cdk-api-gateway-service-integration-sqs/)

---

## Bonus III - Front-End:

- **Create a React app to show the analytics from section 3.**
