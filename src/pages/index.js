import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import Link from 'next/link'


const inter = Inter({ subsets: ['latin'] })


const getData = async (id) => {
  const res = await fetch("/api/data",
    {
      method: "POST",
      body: JSON.stringify({
        id: id
      })
    }
  )
  const response = await res.json()
  return response
}


const styles = {
  container: {
    display: 'grid',
    placeItems: 'center',
  },
  input: {
    color: "#50d811e5",
    marginTop: "2pc",
    display: "block",
    width: "100%",
    textAlign: "center"
  },
  button: {
    marginTop: "1%",
    width: "10pc"
  },
  text: {
    border: "1px solid #333333",
    width: "500px",
    height: "70px",
    overflow: "auto",
    display: "flex"
  },

  textContainer: {
    marginTop: "2.5em"
  },

  title: {
    marginTop: "2pc",
    fontSize: "2em",
    color: "#0bd1b0"
  }
}

const stringIds = (ids) => {
  let idString = ''

  for (let id of ids) {
    idString = idString + id +";"
  }
  return idString
}

const ListIds = ({text,ids}) => {

  let id = stringIds(ids)

  const clickButton = (event) => {
    navigator.clipboard.writeText(id)
  }

  return (<>
      <div style={styles.textContainer}>
          <h1>{text}: </h1>
          <textarea style={styles.text} className="textarea textarea-success" disabled  value={
            ids.length === 0 ? '' : id
          }>
          </textarea>
          <button className='btn btn-outline-secondary' style={{marginTop: "1pc", marginLeft: "1pc"}}
          onClick={clickButton}>Copy</button>
        </div>
  </>)
}

function isInt(value) {
  return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}

//2930609308
export default function Home() {
  let id = ''

  const [isPress, setPress] = useState(false)
  
  const [getState, setState] = useState({
    result: 
      {
        id: [], 
        modId: []
      },
    fails: []
    }
    )
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        clickButton(event)
      }
    };

    const clickButton = (event) => {
        if (id === ''){
          setState({
            result: 
            {
              id: [], 
              modId: []
            },
          fails: ["Enter an ID"]
          })
        }else {
          
          if (!isInt(id)){
            setState({
              result: 
              {
                id: [], 
                modId: []
              },
            fails: ["Enter a valid ID"]
            })
            return
          }
          setPress(true)
          getData(id).then(res => {
            let id = []
            let modId = []
            for (const obj in res["result"]){
              id.push(obj)
              modId.push(res.result[obj])
            }
            const state = {
              result: 
              {
                id,
                modId
              },
            fails: res["fails"]
            }
            
            setState(state)
            setPress(false)
          })
        }
    }

  return (
    <>
      <Head>
        <title>PZ Scrapper App</title>
        <meta name="description" content="You can list a collection in PZ server format" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <div style={styles.container}>
        <h1 style={styles.title}>Project Zomboid Scrapper</h1>
        <input style={styles.input} 
          onKeyDown={handleKeyDown}
          onChange={(e) => id = e.target.value}
          className="input input-primary" placeholder="Collection ID" />
          
        {
          isPress ? <progress className="progress progress-flat-primary"
          style={{marginTop: "1pc"}}></progress> : <button style={styles.button} className="btn btn-outline-primary"
          onClick={clickButton}>GET</button>
        }
        <ListIds text={"Workshop ID"} ids={getState.result.id}/>
        <ListIds text={"Mod ID"} ids={getState.result.modId} />
        <ListIds text={"Fails"} ids={getState.fails} />
        <footer>
          <a target="_blank" href="https://github.com/MitosV" rel="noopener noreferrer">
            <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="octicon octicon-mark-github v-align-middle">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
        </footer>
      </div>
      
    </>
  )
}



