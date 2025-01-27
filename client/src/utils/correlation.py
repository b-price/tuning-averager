import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

# Extracting the data from the provided text
string_gauges = np.array([27,
28,
33,
35,
43,
44])
unit_weights = np.array([0.00009582,
0.00011168,
0.00017066,
0.0001989,
0.00031288,
0.00033914])

# Trying to fit a power law (y = a * x^b) for correlation
def power_law(x, a, b):
    return a * x**b

params, covariance = curve_fit(power_law, string_gauges, unit_weights)

# Plotting the data and the fitted curve
plt.figure(figsize=(10, 6))
plt.scatter(string_gauges, unit_weights, color='blue', label='Data')
plt.plot(string_gauges, power_law(string_gauges, *params), color='red', label=f'Fit: y = {params[0]:.6e} * x^{params[1]:.2f}')
plt.xlabel('String Gauges')
plt.ylabel('Unit Weights')
plt.title('Correlation between String Gauges and Unit Weights')
plt.legend()
plt.grid(True)
plt.show()

print(params)  # Returning the parameters of the fitted model
