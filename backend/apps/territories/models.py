from django.db import models


class Territory(models.Model):
    """Representa un territorio o resguardo indigena."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'territories'
        verbose_name_plural = 'territories'
        ordering = ['name']

    def __str__(self):
        return self.name
