import random
from numpy import exp, array, random, dot
from math import exp


moves = [1, -1, 20, -20]
print(random.choice(moves))

def sigmoid(x):
    return (1/1+exp(-x))

def derivative(a,b):
    return ((a-b)*b*(1-b))
