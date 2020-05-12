// https://khalilstemmler.com/articles/typescript-domain-driven-design/repository-dto-mapper/

interface MessageDto {
    sender: string,
    timestamp: string,
    params: {
        [key: string]: ParameterDto
    };
}

interface ParameterDto {
    name: string
}