## Text Similarity Using Siamese Deep Neural Network

Siamese neural network is a class of **neural network architectures that contain two or more** **identical** **subnetworks**. *identical* here means they have the same configuration with the same parameters 
and weights.This is accompanied with **word cloud and word frquencies obtained from it**
The output given is a probability of acceptance of a student into internship within a range of 0-1.



#### Install dependencies

`pip install -r requirements.txt`

### Usage

Used in probability.py as an example code. 
Please refer to the c_requirements.txt(i.e.company requirements), Projects.txt and skills.txt for the semantics and format of data required for the model.
Send the data in api request's body according to the above mentioned files please :)  

### Running the code

`py -3 probability.py`

### Explanation

In this branch the probability.py imports the my_probability_model.py which inturn imports the siamese network as well. So when calling in an api call it using the strings in the given format of the text files mentioned above.
The output given is a probability of acceptance of a student into internship within a range of 0-1.