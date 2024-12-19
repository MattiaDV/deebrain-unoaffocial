from odoo import fields, models, api

class UsersModel(models.Model):
    _name = "users_model"
    _description = "User Model"

    name = fields.Char(string="Agency Name", required="1")
    founderName = fields.Many2many('founder_name', string="Founder Name")
    numberOfEmployees = fields.Integer(string="Number of employees")
    foundationYear = fields.Date(string="Foundation Year")
    agencyType = fields.Selection([
        ('digital agency', 'Digital agency'),
        ('media center', 'Media center'),
        ('creative agency', 'Creative agency'),
        ('perform agency', 'Perform agency'),
        ('advertising agency', 'Advertising agency'),
        ('marketing agency', 'Marketing agency'),
        ('branding agency', 'Branding agency'),
        ('design agency', 'Design agency'),
        ('web agency', 'Web agency'),
        ('seo agency', 'SEO agency'),
        ('social media agency', 'Social media agency'),
        ('public relations agency', 'Public relations agency'),
        ('event agency', 'Event agency'),
        ('consulting agency', 'Consulting agency'),
        ('production agency', 'Production agency'),
        ('influencer agency', 'Influencer agency'),
        ('digital marketing agency', 'Digital marketing agency'),
        ('content agency', 'Content agency'),
        ('advertising production agency', 'Advertising production agency'),
        ('motion graphics agency', 'Motion graphics agency'),
        ('creative consulting agency', 'Creative consulting agency'),
        ('interactive agency', 'Interactive agency'),
        ('media buying agency', 'Media buying agency')
    ], default="digital agency", string="Agency type")
    logo = fields.Image(string="Logo")
    managedBilling = fields.Integer(string = "Managed billing")
    awareness = fields.Boolean(string="Awareness")
    conversion = fields.Boolean(string="Conversion")
    consideration = fields.Boolean(string="Consideration")
    retention = fields.Boolean(string="Retention")
    advocacy = fields.Boolean(string="Advocacy")

    planning = fields.Boolean(string="Planning")
    project = fields.Boolean(string="Project")
    task = fields.Boolean(string="Task")
    platform = fields.Boolean(string="Platform")
    reporting = fields.Boolean(string="Reporting")
    dataAnalysis = fields.Boolean(string="Data analysis")
    adServer = fields.Boolean(string="Ad Server")
    AdVerification = fields.Boolean(string="Ad Verification")

    website = fields.Char(string="Website")
    linkedinLink = fields.Char(string="Linkedin link")
    facebookLink = fields.Char(string="Facebook link")
    email = fields.Char(string="Email")
    locations = fields.Many2many('location_listing',string="Locations (Italy)")
    locationsNotItaly = fields.Many2many('location_not_italy_listing', string="Locations (Not Italy)")
    mainServices = fields.Many2many('main_services', string="Main services")
    distinctiveServices = fields.Many2many('distinctive_services', string="Distinctive services")
    managedMedia = fields.Many2many('managed_media', string="Managed media")
    managedPlatform = fields.Many2many('managed_platform', string="Managed platform")
    referralClient = fields.Many2many('users_referral_client', string="Referral clients")
    brochure = fields.Char(string="Brochures URL")
    caseStudy = fields.Char(string="Case study URL")
    clientLogos = fields.Many2many('main_client_logos', string="Main client logos")
    languages = fields.Many2many('managed_languages', string="Managed Languages")
    sales = fields.Integer(string="Sales")
    typeAcc = fields.Boolean(string='Agency?')

class ReferralClient(models.Model):
    _name = "users_referral_client"
    _description = "Referral client"

    name = fields.Char(string="Name")
    surname = fields.Char(string="Surname")
    photo = fields.Image(string="Photo")

    @api.depends('mainClient')
    def _compute_work_where(self):
        for record in self:
            if record.mainClient:
                record.workWhere = ', '.join(record.mainClient.mapped('name'))
            else:
                record.workWhere = ''

    workAs = fields.Char(string="Work as")
    workWhere = fields.Char(string="Work")
    mainClient = fields.Many2many('main_client_logos', string="Main client")

class ManagedMedia(models.Model):
    _name = "managed_media"
    _description = "Managed Media"

    name = fields.Char(string="Name")

class ManagedLanguages(models.Model):
    _name = "managed_languages"
    _description = "Managed Languages"

    name = fields.Char(string="Languages")

class ManagedPlatform(models.Model):
    _name = "managed_platform"
    _description = "Managed Platform"

    name = fields.Char(string="Name")

class Locations(models.Model):
    _name = "location_listing"
    _description = "Location listing"

    name = fields.Char(string="Location (Italy)")

class LocationsNotItaly(models.Model):
    _name = "location_not_italy_listing"
    _description = "Location Not Italian"

    name = fields.Char(string="Location (Not Italy)")

class FounderName(models.Model):
    _name = "founder_name"
    _description = "Founder name"

    name = fields.Char(string="Name")
    agency = fields.Many2many('users_model', string="Agency where work")

class MainServices(models.Model):
    _name = "main_services"
    _description = "Main services"

    name = fields.Char(string="Name")
    description = fields.Char(string="Description")


class DistinctiveServices(models.Model):
    _name = "distinctive_services"
    _description = "Distinctive services"

    name = fields.Char(string="Name")
    description = fields.Char(string="Description")

class LogosMainClient(models.Model):
    _name = "main_client_logos"
    _description = "Main client logos"

    name = fields.Char(string="Name of agency")
    logo = fields.Image(string="Logo")