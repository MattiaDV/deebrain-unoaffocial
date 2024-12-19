{
    "name" : "Listing DeeBrain",
    "version" : "1.0",
    "website" : "https://prova.com",
    "author" : "Mattia De Vincentis",
    "description" : "Listing of deebrain",
    "category" : "Sales",
    "depends": ["base"],
    "data" : [
        'security/ir.model.access.csv',
        "views/user_view.xml",
        "views/menuitem_view.xml",

        #Data files
        "data/location_listing.csv",
        "data/distinctive_services.csv",
        "data/main_services.csv",
        "data/managed_media.csv",
        "data/managed_platform.csv",
        "data/location_not_italy_listing.csv",
        "data/managed_languages.csv",
    ],
    "installable" : True,
    "application" : True,
    "license" : "LGPL-3"
}