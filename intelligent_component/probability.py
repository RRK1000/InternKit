import my_probability_model
c_dataset = open("c_requirements.txt", "r").read().lower()
p_dataset= open("Projects.txt","r").read().lower()
skills_dataset=open("skills.txt","r").readlines()
my_probability_model.get_probability(c_dataset,p_dataset,skills_dataset)
