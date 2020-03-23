export namespace AppApiData {
  interface getGithubLastRelease {
    tag_name: string
    body: string

    assets: {
      browser_download_url: string
    }[]
  }
} 