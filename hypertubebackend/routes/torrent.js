var express = require('express');
var router = express.Router();
const fs = require('fs')
const torrentStream = require('torrent-stream')
var magnet_Link = require('magnet-link')
const { authJWT } = require('../middleware')
var sql = require('../query/query')
var s = require('./playmodel')
var path = require('path')

const dest = './public/videos/'
const tpath = '/tmp/torrent-stream/'
let engine = null
let magn = null
let infohash = ''
let status = 'initialized'
let file_name = 'torrent'
let progress = 0

const getMagLink = (uri) => {
    return new Promise((resolve, reject) => {
        magnet_Link(uri, function (err, link) {
            if (err) reject(err);
            resolve(link);
        })
    })
}

async function createMagnet(name) {
    try {
        let createmag = await getMagLink(name);
        // console.log('crete',createmag);
        let url = encodeURI(name)
        let trackers = ''
        let track = ['udp://open.demonii.com:1337/announce',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://glotorrents.pw:6969/announce']
        for (let i in track) {
            let uri = encodeURI(track[i])
            trackers += `&tr=${uri}`
        }
        // console.log('trackers', trackers);
        let magnet = `${createmag}&dn${url}${trackers}`
        // console.log('magnet', magnet)
        return (magnet)
    } catch (e) { console.log(e) }
}

async function checkMagExist(magnet) {
    if (!magn) {
        magn = magnet
        // console.log('mgnet', magn);
        engine = torrentStream(magn)
        // console.log('if magn in torrentstrean', engine)

    } else {
        if (magn !== magnet) {
            await destroyEngine()
            magn = magnet
            console.log('magn2', magn)
            engine = torrentStream(magn)
            console.log('else check mag ', engine)
            infohash = engine.infoHash
        }
    }
}

async function destroyEngine() {
    engine.remove(() => { })
    engine.destroy(() => { status = 'destroyed' })
    engine = null
    mag = null
    // status = 'initialized'
    // file_name = 'stream'

}

async function engines(magnet, title, video_id) {
    await checkMagExist(magnet)
    engine.on('torrent', (fn)=>{
        let movie = fn.files[0].name
        let moviepath = path.join(__dirname, '..', 'public', 'videos', movie)
     fs.stat(moviepath,(err,stats)=>{
         if (err){
             console.log(err)
             if (err.code === 'ENOENT')
             console.log('torrent status')
            return status = 'initialized'; 
         }
            return status= 'exists'
        });
    })
    if (status === 'exists'){
        console.log('Status exists')
        return ({ 'engine': engine, 'status': status, 'file_name': file_name})
    }
    
    engine.on('ready', () => {
     
        console.log('atfirst',status);
        status = 'queued'
        progress = `queued ${title}`
        console.log('status', status)
        let len = engine.files.length
      
        Promise.all(engine.files.map(async (file) => {
            let ext = s.doextension(file.name)
            if (ext === '.mkv' || ext === '.mp4' || ext === '.avi') {
                let check = await sql.checkvideoExists(video_id)
                file_name = file.name
                if (check.length == 0) {
                    let insertv = await sql.insertVideoD(video_id, title, file.name, ext, file.length, engine.infoHash)
                    file_name = file.name
                    if (insertv.length != 0) {
                        status = 'downloading'
                        let stream = file.createReadStream()
                        let save = fs.createWriteStream(dest + file.name)
                        stream.pipe(save)
                        engine.on('download', (fn) => {
                            console.log(fn)
                        })
                        stream.on('end', async () => {
                            status = 'complete'
                            console.log(`download finished (${file.name})`)
                            len--
                            console.log('length', len);
                                console.log('update status done downloading');
                                await sql.Updatevideo(status, video_id)
                                status = 'finished'
                                engine.on('idle', () => {
                                    status = 'finished'
                                    console.log('its done')
                                })
                                console.log('end')

                        })
                    } else {
                        status = 'exists'
                    }
                } else {
                    status = 'exists'
                }
            }
        }))
    })

    return ({ 'engine': engine, 'status': status, 'file_name': file_name, 'infohash': infohash })
}

router.get('/',  [authJWT.verifyToken],  async function (req, res) {

    var apiurl = req.query.url
    var video_id = req.query.id
    var title = req.query.title
    try {
        let mag = await createMagnet(apiurl);
        let engine = await engines(mag, apiurl, video_id)
        if (engine.status == 'finished' || engine.status == 'exists') {
            console.log('engine.filename   ', engine.file_name)
            res.send(200,{message : engine.file_name})
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/video',/*  [authJWT.verifyToken] */  async (req, res) => {
    let movie = req.query.movie
    let moviepath = path.join(__dirname, '..', 'public', 'videos', movie)
    const range = req.headers.range;
    const stat = fs.statSync(moviepath);
    const fileSize = stat.size;
    console.log('playyying')
    if(range) {

        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const stream = fs.createReadStream(moviepath, { start, end })
        const head = {
            'Content-Range': `bytes ${start} - ${end} / ${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        console.log('res in video', res);
        res.writeHead(206, head)
        stream.pipe(res)
       
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
                res.writeHead(200, head)
                fs.createReadStream(moviepath).pipe(res)
      
    }
})


module.exports = router;