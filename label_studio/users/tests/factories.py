import factory
from organizations.models import OrganizationMember
from users.models import User


class UserFactory(factory.django.DjangoModelFactory):
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    username = factory.LazyAttribute(lambda u: u.email.split('@')[0])
    password = factory.Faker('password')

    class Meta:
        model = User

    @factory.post_generation
    def active_organization(self, create, extracted, **kwargs):
        if not create or not extracted:
            return
        self.active_organization = extracted
        self.save(update_fields=['active_organization'])
        OrganizationMember.objects.create(user=self, organization=extracted)
