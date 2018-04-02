## Client Share

The Client Share app is used to improve business results by strengthening and deepening account relationships between buyers and sellers across the globe.

Client Share is a secure, collaborative, digital community for Sales and Account Management, giving you and your client one place to share and access content, collaborate, and rate your business relationship anytime, anywhere. And our relationship analytics enable decisions to be made based on account insight not hindsight.

## About Project

- Language: PHP (7.0)
- Framework: Laravel ( 5.3 )
- Database: PostgreSql

## How to install project on local
  
   Open CLI and run following commands to set up at local:
   - **Clone the project**
        >
            git clone https://github.com/uCreateit/clientshare-web.git

  - **Set permissions**
       >
            sudo chmod -R 777 { project-storage-path }
            sudo chmod -R 777 { project-bootstrap-path }

  - **Go to project directory**
       >
            cd clientshare-web

  - **Copy .env.example to .env**
       >
            cp .env.example .env

- **Install the dependencies**    
>
           composer install
  


# Database installation
- **How to install postgresql ( Ubuntu )**
    >
        sudo apt-get install postgresql postgresql-contrib
- **Which UI being used to connect to DB**
    >
        pgadmin
- **Create  database**
    >
         1. login to pgsql
          sudo psql -h localhost -U postgres    
          2. create database clientshare;

# Post Installation steps
 - **Run database migrations**
    >
        php artisan migrate

- **Start server**
    >
        php artisan serve
        The API will be running on localhost:8000 now

# External Services/API Reference
- **Email Service**
    >
	 - PostMark
	 - Create Account on Postmark (https://postmarkapp.com) and verify the sender signatures.
	 - Create email templetes on Postmark
	 - Set Postmark token and template IDs in environment/config variables
- **Images Storage**
    >
        - AWS S3
         1. Your S3 credentials can be found on the Security Credentials section of AWS Account
         2. To create a bucket access the S3 section of the AWS Management Console
         3. Set AWS access key, secret key, bucket name etc. as environment variables.
        Reference: https://aws.amazon.com/s3

- **Embed.ly:**
   >
        It is used for getting the url metadata
        Reference: http://embed.ly

- **Linkedin API:**
   >
        It is used to get the information from linkedin
        Reference: https://developer.linkedin.com
