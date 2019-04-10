class FileService {

    constructor(
        private ipfs: any
    ) {}

    async writeToAll(data: any, files: string[]) : Promise<any>  {

        const buffer: Buffer = Buffer.from(JSON.stringify(data))
        
        return this.writeBufferToAll(buffer, files)
    }

    async writeBufferToAll(buffer: Buffer, files: string[]) : Promise<any> {

        let promises: Promise<void>[] = []

        for (let path of files) {
            
            promises.push(
                this.ipfs.files.write( path, buffer, {
                    create: true, 
                    parents: true, 
                    truncate: true
                })
            )
        } 

        return Promise.all(promises)
    }

    async deleteAll(files: string[]) : Promise<any> {

        let promises: Promise<void>[] = []

        for (let path of files) {
            if (this.fileExists(path)) {
                promises.push(this.ipfs.files.rm(path))
            }
        }

        return Promise.all(promises)
    }


    async loadFile(filename: string) : Promise<any> {

        let contents: any

        try {
            let fileContents: Buffer  = await this.ipfs.files.read(filename)
            contents = JSON.parse(fileContents.toString())
        } catch(ex) {
            //File not found
            // console.log(`File not found: ${filename}`)
        }

        return contents
    }

    async loadFileXml(filename: string) : Promise<any> {

        let contents: any 


        return contents 

    }




    async fileExists(filename: string) : Promise<boolean> {

        let exists: boolean = false

        try {
            const hash = await this.ipfs.files.stat(filename, { hash: true})
            exists = true
        } catch(ex) {
            // console.log(ex)
        }

        return exists
    }

    async listFromDirectory(folderName: string ) : Promise<any[]> {
        
        let results = []

        try {
            let files = await this.ipfs.files.ls(folderName)
            for (let file of files) {

                let filename = `${folderName}/${file.name}`
                try {
                    let result = await this.loadFile(filename)
                    results.push(result)
                } catch (ex) {
                    // console.log(`Error reading file: ${filename}`)
                    // console.log(ex)
                }
            }
        } catch (ex) {
            // console.log(`Error: ${folderName}`)
            // console.log(ex)
        }

        
        return results
    }


}

export { 
    FileService
}