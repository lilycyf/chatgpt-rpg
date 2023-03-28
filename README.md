# Chatbot using OpenAI's GPT-3

This project is a chatbot application that uses OpenAI's GPT-3 to generate responses to user input.

## Getting Started

1. Clone this repository to your local machine.
2. (optional) Create a virtual environment for the project using `env\Scripts\activate.bat` (On Windows) or `sourceenv/bin/activate` (On macOS or Linux)
3. Install the required packages using `pip install -r requirements.txt`
4. Make a copy of  `config.py` with name `mine_config.py`
5. Generate your own secret key in Django by running the command `python manage.py generate_secret_key` in your terminal. Replace the `SECRET_KEY` in `mine_config.py` under the `chatbot` folder with the key that you generated.
6. Sign up for an API key from OpenAI's GPT-3.5 platform. Generate an API key for OpenAI's GPT-3 service by following the instructions on the [OpenAI website](https://beta.openai.com/docs/api-reference/authentication) and replace the `OPENAI_API_KEY` in `mine_config.py` under the `chatbot` folder with your own key.

## Running the Chatbot

Note: If you set up a virtual environment in step 2 you will need to activate it before running any commands related to the project. To activate the virtual environment, run `source env/bin/activate`. To deactivate it, simply run the `deactivate` command. 

Before start the server, navigate to the root folder of the project in your terminal and run the command `python manage.py migrate` to apply the database migrations.

To run the chatbot, run the command `python manage.py runserver`. Then open your web browser and go to `http://localhost:8000` to access the chatbot application.

## Conclusion

This project provides an example of how to build a chatbot application using OpenAI's GPT-3.5. Feel free to modify the code to suit your needs, and don't forget to create your own secret key and API key when running the application.
