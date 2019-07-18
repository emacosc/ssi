import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from './utils/getWeb3'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: '0xC7d10bbE0962EbfF737f7426be85C2eBD9485F3F',
    contracts:{
      pistisDIDRegistry: '0xf0aFD24D86845fA6EB9586E2078f08A2A26409C7',
      credentialStatusRegistry: '0x08D3864Fd1cD54A98a7eef2F4BA5bf1B126a8097',
      TCM: '' ,
      multiSigOperations: '0x8033EEf2B7243999f4d9D1998c6ec95052caC3E8'
    },
    lastUpdate: '123455688',
    credentials: [{
        iat: '1562000791383',
        iss: '3984324',
        csu: {
          name: 'Cred1'
        }
      },
      {
        iat: '1562000793343',
        iss: '3984324',
        csu: {
          name: 'Cred2'
        }
      },
      {
        "iat": 1562077338339,
        "exp": 1,
        "sub": "did:ethr:0x45",
        "iss": "did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840",
        "csu": {
          "context": "https://schema.org",
          "name": "My Address",
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streeAddress": "strada cà cornuta, 2"
          }
        },
        "csl": {
          "id": 0,
          "type": "Pistis-CSL/v1.0"
        }
      }
    ],
    tcl: {
      "@context": "pistis-tcl/v1",
      "tcl": [{
          src: "this",
          did: "did:ethr:0x09e3e5a2bfb3acaf00a52b458ef119801be0fdaf",
          ent: {
            type: "Person",
            name: "Doctor Who",
            familyName: "Who",
            givenName: "Jake",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xdko03aw0j76f894824rt2cdef7a2018dbe32md97",
          ent: {
            type: "Person",
            name: "Doctor Abela",
            familyName: "Mark",
            givenName: "Abela",
            affiliation: {
              type: "Hospital",
              name: "St. Luke's Hospital",
              address: {
                type: "Postal Address",
                streetAddress: "St. Lukes Square",
                addressLocality: "G'Mangia Pieta",
                addressRegion: "PTA",
                postalCode: "1010"
              }
            }
          }
        },
        {
          src: "this",
          did: "did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840",
          ent: {
            type: "MedicalOrganization",
            name: "MyHealth",
            url: "https://myhealth-ng.gov.mt/"
          }
        },
        {
          src: "this",
          did: "did:ethr:0xeee6f3258a5c92e4a6153a27e251312fe95a19ae",
          ent: {
            type: "Organization",
            name: "IdentityMalta",
            url: "https://identitymalta.com"
          }
        },
        {
          src: "https://www.myhealth-ng.gov.mt/trsuted-contacts-list",
          did: null,
          ent: null
        }
      ]
    },
    delegates:{
      identity: ['0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18','0xbc3ae59bc76f894822622cdef7a2018dbe353840'],
      credentialStatus: ['0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18'],
      TCM: ['0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18']
    },
    pendingOperations:{
      pistisDIDRegistry: [
        {
          opId: '12',
          pendingInfo: '0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18' // delegates to be added
        },
        {
          opId: '13',
          pendingInfo: '0xbc3ae59bc76f894822622cdef7a2018dbe353840'
        },
        {
          opId: '14',
          pendingInfo: '0xeee6f3258a5c92e4a6153a27e251312fe95a19ae'
        },
      ],
      credentialStatusRegistry: [
        {
          opId: '12',
          pendingInfo: '2' // credential ID to be set
        },
      ],
      TCM: '' ,
    },
    vcBuilder:{
      credential: {},
      credentialBackup:{
          iat: new Date().getTime(),
          exp: 1,
          sub: "did:ethr:0x45",
          iss: "did:ethr:0x9fe146cd95b4ff6aa039bf075c889e6e47f8bd18",
          csu: {
              context: "https://schema.org",
              name: "My new credential"
          },
          csl: {
              id: 0,
              type: "Pistis-CSL/v1.0"
          }
      },
      credentialData: []
    },
    web3: {
      web3Instance: null
    },
  },
  mutations: {
    addVC(state, payload) {
      state.credentials.push(payload.newVC)
    },
    editTCL(state, payload) {
      state.tcl = payload.tcl
    },
    updateVC(state, cred){
      console.log("updating", cred)
      state.vcBuilder.credential = cred
    },
    updateData(state, data){
      state.vcBuilder.credentialData = [... state.vcBuilder.credentialData, data]
    },
    deleteData(state){
      state.vcBuilder.credentialData = []
    },
    registerWeb3Instance (state, payload) {
      console.log('registerWeb3instance Mutation being executed', payload)
      let result = payload
      let web3Copy = state.web3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
    }
  },

  actions: {
    async registerWeb3 (context) {
      try{
        console.log('registerWeb3 Action being executed')
        const result = await getWeb3()
        context.commit('registerWeb3Instance', result)
      } catch(err){
        console.log("error in registerWeb3 action", err)
      }
    }
  }
})
