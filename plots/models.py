from django.db import models

class Plot(models.Model):
    name = models.CharField(max_length=100)
    area = models.DecimalField(max_digits=6, decimal_places=2)  # площадь в м²
    soil_type = models.CharField(max_length=50)
    light_barriers = models.TextField(blank=True)
    wind_barriers = models.TextField(blank=True)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
