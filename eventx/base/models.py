from django.db import models
from users.models import User 
from events.models import Event

class Notification(models.Model):
    message = models.CharField(max_length=200)
    

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_comments')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='children',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {'Reply' if self.parent else 'Comment'} on {self.event.title}"
    
    @property
    def is_reply(self):
        return self.parent is not None
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_ratings')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ratings')
    rating = models.FloatField(choices=[(i, str(i)) for i in range(1, 6)])  # 1 to 5 stars
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event') 
    def __str__(self):
        return f"{self.user.username} rated {self.rating} for {self.event.title}"