describe('récupérer les notes http get ', () => {
    it('réponse 200', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'GET',
            url: 'https://practice.expandtesting.com/notes/api/notes',
            headers: {
                'x-auth-token': token
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});

describe('creer une note HTTP POST ', () => {
    it('status 200', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'POST',
            url: 'https://practice.expandtesting.com/notes/api/notes',
            headers: {
                'x-auth-token': token
            },
            body: {
                "title": "Note1",
                "description": "Description",
                "category": "Work",

            }
        }).then((response) => {
            // Vérifier le statut de la réponse
            expect(response.status).to.eq(200);
            //vérifier le message dans le body
            expect(response.body.message).to.eq('Note successfully created');
        });

    });

    it('Status 400', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'POST',
            url: 'https://practice.expandtesting.com/notes/api/notes',
            headers: {
                'x-auth-token': token

            },
            body: {
                "title": "Note1",
                "description": "Description",
                "category": "travel",
            },
            failOnStatusCode: false

        }).then((response) => {
            // Vérifier le statut de la réponse
            expect(response.status).to.eq(400);
            //vérifier request incorrect
            expect(response.body.message).to.eq('Category must be one of the categories: Home, Work, Personal');
        });
    });

    it('créer note depuis Data Source', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";
        cy.fixture('NoteData').then(note => {
            const newNote = {
                title: note.title,
                description: note.description,
                category: note.category
              };
            cy.request({
                method: 'POST',
                url: 'https://practice.expandtesting.com/notes/api/notes',
                headers: {
                    'x-auth-token': token
                },
                body: newNote
    
            }).then((response) => {
                // Vérifier le statut de la réponse
                expect(response.status).to.eq(200);
                //vérifier le message dans le body
                expect(response.body.message).to.eq('Note successfully created');
            });
        })
    
        });
    
});
describe('Récupérer une note par son ID  HTTP GET', () => {
    it('réponse 200', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'Get',
            url: 'https://practice.expandtesting.com/notes/api/notes/64595b21b91d0002115f3e2c',
            headers: {
                'x-auth-token': token
            },
            body: {
                "id": "12345664595b21b91d0002115f3e2c",
            },

        }).then((response) => {
            expect(response.status).to.eq(200)

        });

    });

    it('réponse 401 sans token', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'Get',
            url: 'https://practice.expandtesting.com/notes/api/notes/64595b21b91d0002115f3e2c',
            body: {
                "id": "12345664595b21b91d0002115f3e2c",
            },
            failOnStatusCode: false

        }).then((response) => {
            expect(response.status).to.eq(401);

        });
    });
});


describe('mettre à jour la Note1', () => {
    it('Vérifie que les champs de la réponse sont corrects', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'PUT',
            url: 'https://practice.expandtesting.com/notes/api/notes/645a07f771406802114cfde8',
            headers: {
                'x-auth-token': token
            },
            body: {
                "id": "645a07f771406802114cfde8",
                "title": "Note1",
                "description": "description",
                "completed": true,
                "category": "Work",
            },

        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.success).to.eq(true)
            expect(response.body.message).to.include("Note successfully Updated")
            expect(response.body.data.completed).to.be.true
        });

    });
});


describe('mettre à jour le status completed de la Note1', () => {
    it('Vérifie que les champs de la réponse sont corrects', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        cy.request({
            method: 'PATCH',
            url: 'https://practice.expandtesting.com/notes/api/notes/645a07f771406802114cfde8',
            headers: {
                'x-auth-token': token
            },
            body: {
                "id": "645a07f771406802114cfde8",
                "completed": false,

            },
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.success).to.eq(true)
            expect(response.body.message).to.include("Note successfully Updated")
            expect(response.body.data.completed).to.be.false
        });

    });
});

describe('Créer et supprimer la Note1', () => {
    it('créer une note et la supprimer', () => {
        const token = "6342a2ce219a492e853e7e3e15cfac17e7b07371fdc349249d7e60a28891c48d";

        // Envoyer une requête POST pour créer la note
        cy.request({
            method: 'POST',
            url: 'https://practice.expandtesting.com/notes/api/notes',
            headers: {
                'x-auth-token': token
            },
            body: {
                "title": "Note2",
                "description": "création d'une note",
                "category": "Home"
            }
        }).then(response => {
            // Récupérer l'ID de la note créée
            const noteId = response.body.data.id;

            // Envoyer une requête DELETE pour supprimer la note créée
            cy.request({
                method: 'DELETE',
                url: `https://practice.expandtesting.com/notes/api/notes/${noteId}`,
                headers: {
                    'x-auth-token': token
                }
            }).then(deleteResponse => {
                // Vérifier que la note a été supprimée avec succès
                expect(deleteResponse.status).to.equal(200);
                expect(deleteResponse.body.success).to.be.true;
            });
        });
    });
});
