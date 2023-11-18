import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
} from '@nestjs/common';
import { AudiosService } from './audios.service';
import {
  CreateAudioDto,
  CreateAudioWithUploadDto,
} from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AudioFileValidator } from './audio-file-validator';

@Controller('audios')
export class AudiosController {
  constructor(private readonly audiosService: AudiosService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAudioWithUploadDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createAudioDto: CreateAudioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new AudioFileValidator({
            maxSize: 1024 * 1024 * 100,
            mimeType: 'audio/mpeg',
          }),
        ],
        errorHttpStatusCode: 422,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.audiosService.createAudio({ ...createAudioDto, file });
  }

  @Get()
  findAll() {
    return this.audiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.audiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAudioDto: UpdateAudioDto) {
    return this.audiosService.update(+id, updateAudioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.audiosService.remove(+id);
  }
}
