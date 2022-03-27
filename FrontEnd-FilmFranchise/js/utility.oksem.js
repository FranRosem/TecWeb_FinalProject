function sanatizePath(source)
{
    let splitedUrl = source.split("\\");
	return splitedUrl[0] + "/" + splitedUrl[1] + "/" + splitedUrl[2];
}

export default sanatizePath;